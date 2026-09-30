import React, { useState, useRef, useEffect } from 'react';
import { SongInput, EditorState, TextConfig } from '../types';
import { Download, Save, ArrowLeft, Type, MoveVertical, MoveHorizontal, Palette, Wand2, Eye, EyeOff, Layers } from 'lucide-react';
import { removeBackground, Config } from '@imgly/background-removal';

interface EditorProps {
  generatedImage: string;
  input: SongInput;
  initialState?: EditorState;
  onSave: (finalImage: string, editorState: EditorState) => void;
  onBack: () => void;
}

const FONTS = [
  // --- BOLD & IMPACT (ENGLISH) ---
  { name: 'Anton', value: 'Anton', label: 'Anton (Tall Impact)' },
  { name: 'Bebas Neue', value: 'Bebas Neue', label: 'Bebas Neue (Condensed)' },
  { name: 'Alfa Slab One', value: 'Alfa Slab One', label: 'Alfa Slab (Heavy Serif)' },
  { name: 'Rubik Mono One', value: 'Rubik Mono One', label: 'Rubik Mono (Chunky)' },
  { name: 'Russo One', value: 'Russo One', label: 'Russo (Blocky)' },
  { name: 'Rowdies', value: 'Rowdies', label: 'Rowdies (Heavy Round)' },
  { name: 'Luckiest Guy', value: 'Luckiest Guy', label: 'Luckiest Guy (Funky)' },
  { name: 'Oswald', value: 'Oswald', label: 'Oswald (Bold)' },
  { name: 'Righteous', value: 'Righteous', label: 'Righteous (Modern)' },
  { name: 'Orbitron', value: 'Orbitron', label: 'Orbitron (Sci-Fi)' },
  { name: 'Abril Fatface', value: 'Abril Fatface', label: 'Abril (Fashion Serif)' },
  { name: 'Fugaz One', value: 'Fugaz One', label: 'Fugaz (Italic)' },
  { name: 'Monoton', value: 'Monoton', label: 'Monoton (Retro Lines)' },
  { name: 'Permanent Marker', value: 'Permanent Marker', label: 'Marker (Graffiti)' },
  { name: 'Carter One', value: 'Carter One', label: 'Carter (Toon)' },
  
  // --- BOLD & KOREAN ---
  { name: 'Black Han Sans', value: 'Black Han Sans', label: 'KR Black (강렬한 고딕)' },
  { name: 'Do Hyeon', value: 'Do Hyeon', label: 'KR DoHyeon (레트로)' },
  { name: 'Jua', value: 'Jua', label: 'KR Jua (둥근 고딕)' },
  { name: 'Gugi', value: 'Gugi', label: 'KR Gugi (퓨처리스틱)' },
  { name: 'Kirang Haerang', value: 'Kirang Haerang', label: 'KR Kirang (붓글씨)' },
];

const EFFECTS = [
  { id: 'none', name: 'None' },
  { id: 'shadow-hard', name: 'Hard Shadow' },
  { id: 'shadow-soft', name: 'Soft Shadow' },
  { id: 'outline-black', name: 'Outline Black' },
  { id: 'outline-white', name: 'Outline White' },
  { id: 'neon-green', name: 'Neon Green' },
  { id: 'neon-pink', name: 'Neon Pink' },
  { id: 'neon-blue', name: 'Neon Blue' },
  { id: 'glitch', name: 'Cyber Glitch' },
  { id: 'echo', name: 'Echo' },
  { id: 'mirror', name: 'Reflection' },
  { id: 'gradient-gold', name: 'Gold' },
  { id: 'gradient-silver', name: 'Silver' },
  { id: 'gradient-rainbow', name: 'Rainbow' },
  { id: 'deep-3d', name: 'Deep 3D' },
];

const Editor: React.FC<EditorProps> = ({ generatedImage, input, initialState, onSave, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1024, height: 1024 });
  
  // Depth Effect State
  const [isDepthMode, setIsDepthMode] = useState(false);
  const [foregroundImage, setForegroundImage] = useState<HTMLImageElement | null>(null);
  const [isProcessingDepth, setIsProcessingDepth] = useState(false);

  // Calculate defaults based on approximate expected aspect ratio (updated in useEffect when image loads)
  const [titleConfig, setTitleConfig] = useState<TextConfig>(initialState?.title || {
    text: input.title,
    x: 512, // Will update on load
    y: 100,
    fontSize: 100, 
    fontFamily: 'Anton',
    color: '#FFFFFF',
    effect: 'shadow-hard',
    visible: false // Default to hidden, as we assume text is either in the image (AI) or user wants clean image
  });
  
  const [artistConfig, setArtistConfig] = useState<TextConfig>(initialState?.artist || {
    text: input.artist,
    x: 512, // Will update on load
    y: 900,
    fontSize: 50,
    fontFamily: 'Bebas Neue',
    color: '#39FF14',
    effect: 'none',
    visible: false // Default to hidden
  });
  
  const [activeTab, setActiveTab] = useState<'title' | 'artist'>('title');

  // Background Removal Logic
  useEffect(() => {
    if (isDepthMode && !foregroundImage && !isProcessingDepth) {
      const processBackgroundRemoval = async () => {
        setIsProcessingDepth(true);
        try {
          const config: Config = {
            publicPath: 'https://static.img.ly/background-removal-data/1.7.0/', // Match installed version
          };
          const blob = await removeBackground(generatedImage, config);
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.src = url;
          img.onload = () => {
            setForegroundImage(img);
            setIsProcessingDepth(false);
          };
        } catch (error) {
          console.error("Failed to remove background:", error);
          setIsProcessingDepth(false);
          setIsDepthMode(false); // Revert toggle if failed
          alert("인물 분리에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
      };
      processBackgroundRemoval();
    }
  }, [isDepthMode, generatedImage, foregroundImage, isProcessingDepth]);

  // Drawing Helper
  const drawTextWithEffect = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    x: number, 
    y: number, 
    config: TextConfig
  ) => {
    if (!config.visible) return;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${config.fontSize}px "${config.fontFamily}"`;
    
    const { color, effect } = config;

    switch (effect) {
      case 'shadow-hard':
        ctx.shadowColor = 'rgba(0,0,0,1)';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 8;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        break;

      case 'shadow-soft':
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        break;

      case 'outline-black':
        ctx.lineWidth = config.fontSize * 0.08;
        ctx.strokeStyle = '#000000';
        ctx.lineJoin = 'round';
        ctx.strokeText(text, x, y);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        break;
      
      case 'outline-white':
        ctx.lineWidth = config.fontSize * 0.08;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineJoin = 'round';
        ctx.strokeText(text, x, y);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        break;

      case 'neon-green':
        ctx.shadowColor = '#39FF14';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 10;
        ctx.strokeText(text, x, y);
        break;

      case 'neon-pink':
        ctx.shadowColor = '#FF00FF';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(text, x, y);
        break;

      case 'neon-blue':
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(text, x, y);
        break;

      case 'glitch':
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255,0,0,0.8)';
        ctx.fillText(text, x - 5, y);
        ctx.fillStyle = 'rgba(0,255,255,0.8)';
        ctx.fillText(text, x + 5, y);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        break;

      case 'echo':
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.fillText(text, x - 20, y);
        ctx.fillText(text, x + 20, y);
        ctx.globalAlpha = 1.0;
        ctx.fillText(text, x, y);
        break;

      case 'deep-3d':
        ctx.fillStyle = '#1a1a1a'; // Deep layer
        ctx.fillText(text, x + 6, y + 6);
        ctx.fillStyle = '#333333'; // Mid layer
        ctx.fillText(text, x + 3, y + 3);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        break;
      
      case 'mirror':
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.save();
        ctx.globalAlpha = 0.2;
        // Simple reflection effect
        ctx.transform(1, 0, 0, -1, 0, y * 2 + config.fontSize * 0.8); 
        ctx.fillText(text, x, y);
        ctx.restore();
        break;

      case 'gradient-gold':
        const gradientGold = ctx.createLinearGradient(x, y - config.fontSize/2, x, y + config.fontSize/2);
        gradientGold.addColorStop(0, '#FFD700');
        gradientGold.addColorStop(0.5, '#FDB931');
        gradientGold.addColorStop(1, '#9E7206');
        ctx.fillStyle = gradientGold;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 5;
        ctx.fillText(text, x, y);
        break;

      case 'gradient-silver':
        const gradientSilver = ctx.createLinearGradient(x, y - config.fontSize/2, x, y + config.fontSize/2);
        gradientSilver.addColorStop(0, '#F7F7F7');
        gradientSilver.addColorStop(0.5, '#AFAFAF');
        gradientSilver.addColorStop(1, '#575757');
        ctx.fillStyle = gradientSilver;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 5;
        ctx.fillText(text, x, y);
        break;

      case 'gradient-rainbow':
        const gradientRainbow = ctx.createLinearGradient(x - 200, y, x + 200, y);
        gradientRainbow.addColorStop(0, "red");
        gradientRainbow.addColorStop(0.17, "orange");
        gradientRainbow.addColorStop(0.33, "yellow");
        gradientRainbow.addColorStop(0.5, "green");
        gradientRainbow.addColorStop(0.666, "blue");
        gradientRainbow.addColorStop(0.83, "indigo");
        gradientRainbow.addColorStop(1, "violet");
        ctx.fillStyle = gradientRainbow;
        ctx.fillText(text, x, y);
        break;

      default: // 'none'
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        break;
    }
    ctx.restore();
  };

  // Main Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = generatedImage;
    
    img.onload = () => {
      // Set canvas size to match image size
      if (canvas.width !== img.width || canvas.height !== img.height) {
          canvas.width = img.width;
          canvas.height = img.height;
          setCanvasDimensions({ width: img.width, height: img.height });
          
          // Only recenter if it's the very first load and no state was passed
          if (!initialState) {
              const centerX = img.width / 2;
              setTitleConfig(prev => ({ ...prev, x: centerX, y: img.height * 0.15 })); // 15% from top
              setArtistConfig(prev => ({ ...prev, x: centerX, y: img.height * 0.9 })); // 90% from top
          }
      }

      // 1. Clear and Draw Base Image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 2. Draw Title
      drawTextWithEffect(ctx, titleConfig.text, titleConfig.x, titleConfig.y, titleConfig);

      // 3. Draw Artist
      drawTextWithEffect(ctx, artistConfig.text, artistConfig.x, artistConfig.y, artistConfig);

      // 4. Draw Foreground (Subject) if Depth Mode is ON
      if (isDepthMode && foregroundImage) {
        ctx.drawImage(foregroundImage, 0, 0, canvas.width, canvas.height);
      }
    };
  }, [generatedImage, titleConfig, artistConfig, initialState, isDepthMode, foregroundImage]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Use title as filename (remove invalid chars), fallback to default if empty
    const safeTitle = input.title.trim().replace(/[\\/:*?"<>|]/g, "");
    const fileName = safeTitle ? safeTitle : `neonart-${Date.now()}`;
    
    const link = document.createElement('a');
    link.download = `${fileName}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  const handleSaveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL('image/jpeg', 0.9), {
      title: titleConfig,
      artist: artistConfig
    });
  };

  const activeConfig = activeTab === 'title' ? titleConfig : artistConfig;
  const setActiveConfig = activeTab === 'title' ? setTitleConfig : setArtistConfig;

  return (
    <div className="flex flex-col lg:flex-row h-screen max-h-screen overflow-hidden bg-deep-black">
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-black/50 relative">
        <div className="relative shadow-2xl shadow-neon-green/20 max-h-full">
            <canvas
                ref={canvasRef}
                className="max-w-full max-h-[80vh] w-auto h-auto rounded-lg border border-white/10 object-contain"
            />
            {isProcessingDepth && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-neon-green font-bold text-sm animate-pulse">AI가 인물을 인식중입니다...</span>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-full lg:w-96 bg-gray-900 border-l border-white/10 flex flex-col h-full overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Edit
          </button>
          <h2 className="text-2xl font-display font-bold text-white">Editor</h2>
        </div>

        <div className="flex border-b border-white/10">
          <button 
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'title' ? 'bg-white/10 text-neon-green' : 'text-gray-500 hover:text-white'}`}
            onClick={() => setActiveTab('title')}
          >
            TITLE
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'artist' ? 'bg-white/10 text-cyber-pink' : 'text-gray-500 hover:text-white'}`}
            onClick={() => setActiveTab('artist')}
          >
            ARTIST
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Text Content & Visibility */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-xs text-gray-400 font-mono">TEXT CONTENT</label>
                <button
                    onClick={() => setActiveConfig({ ...activeConfig, visible: !activeConfig.visible })}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${activeConfig.visible ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-400'}`}
                >
                    {activeConfig.visible ? <Eye size={12}/> : <EyeOff size={12}/>}
                    {activeConfig.visible ? 'VISIBLE' : 'HIDDEN'}
                </button>
            </div>
            <input
              type="text"
              value={activeConfig.text}
              onChange={(e) => setActiveConfig({ ...activeConfig, text: e.target.value })}
              className={`w-full bg-black border rounded-lg px-3 py-2 text-white outline-none transition-colors ${activeConfig.visible ? 'border-white/20 focus:border-neon-green' : 'border-red-900/50 text-gray-500'}`}
              disabled={!activeConfig.visible}
            />
          </div>

          {/* Controls Container - Disabled if invisible */}
          <div className={`space-y-6 transition-opacity ${activeConfig.visible ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            
            {/* Depth Effect Toggle */}
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-cyber-pink" />
                  <span className="text-sm font-bold text-white">Depth Effect</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={isDepthMode}
                    onChange={(e) => setIsDepthMode(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyber-pink"></div>
                </label>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 ml-6">
                Place text behind the main subject. (AI Processing)
              </p>
            </div>

            {/* 1. Font Family Selector */}
            <div className="space-y-2">
                <label className="text-xs text-gray-400 font-mono flex items-center gap-2"><Type size={12}/> FONT FAMILY (BOLD)</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {FONTS.map(font => (
                    <button
                    key={font.value}
                    onClick={() => setActiveConfig({ ...activeConfig, fontFamily: font.value })}
                    className={`px-3 py-2 rounded-lg text-left text-sm transition-colors border ${activeConfig.fontFamily === font.value ? 'border-neon-green bg-neon-green/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                    style={{ fontFamily: font.value }}
                    >
                    {font.label}
                    </button>
                ))}
                </div>
            </div>

            {/* 2. Effect Selector */}
            <div className="space-y-2">
                <label className="text-xs text-gray-400 font-mono flex items-center gap-2"><Wand2 size={12}/> TEXT EFFECT</label>
                <select
                value={activeConfig.effect}
                onChange={(e) => setActiveConfig({ ...activeConfig, effect: e.target.value })}
                className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white focus:border-neon-green outline-none"
                >
                {EFFECTS.map(effect => (
                    <option key={effect.id} value={effect.id}>{effect.name}</option>
                ))}
                </select>
            </div>

            {/* 3. Color Picker */}
            <div className="space-y-2">
                <label className="text-xs text-gray-400 font-mono flex items-center gap-2"><Palette size={12}/> COLOR</label>
                <div className="flex gap-3 items-center">
                <div className="relative w-full">
                    <input
                    type="color"
                    value={activeConfig.color}
                    onChange={(e) => setActiveConfig({ ...activeConfig, color: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                    />
                </div>
                <input 
                    type="text" 
                    value={activeConfig.color}
                    onChange={(e) => setActiveConfig({ ...activeConfig, color: e.target.value })}
                    className="w-24 bg-black border border-white/20 rounded-lg px-3 py-2 text-white text-sm uppercase"
                />
                </div>
            </div>

            {/* Size & Position */}
            <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-mono">SIZE</label>
                    <input
                    type="range"
                    min="20"
                    max="400"
                    value={activeConfig.fontSize}
                    onChange={(e) => setActiveConfig({ ...activeConfig, fontSize: Number(e.target.value) })}
                    className="w-full accent-white"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 font-mono flex items-center gap-2"><MoveHorizontal size={12}/> HORIZONTAL</label>
                        <input
                        type="range"
                        min="0"
                        max={canvasDimensions.width}
                        value={activeConfig.x}
                        onChange={(e) => setActiveConfig({ ...activeConfig, x: Number(e.target.value) })}
                        className="w-full accent-neon-green"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 font-mono flex items-center gap-2"><MoveVertical size={12}/> VERTICAL</label>
                        <input
                        type="range"
                        min="0"
                        max={canvasDimensions.height}
                        value={activeConfig.y}
                        onChange={(e) => setActiveConfig({ ...activeConfig, y: Number(e.target.value) })}
                        className="w-full accent-cyber-pink"
                        />
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-white/10 space-y-3">
          <button 
            onClick={handleDownload}
            className="w-full py-3 bg-white/5 border border-white/20 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={18} /> Download Image
          </button>
          <button 
            onClick={handleSaveToGallery}
            className="w-full py-3 bg-gradient-to-r from-neon-green to-emerald-500 text-black rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all"
          >
            <Save size={18} /> Save & Finish
          </button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Editor;