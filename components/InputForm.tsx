import React, { useState } from 'react';
import { SongInput, ArtStyle } from '../types';
import { ART_STYLES, MUSIC_GENRES, CHARACTER_SAMPLES, VISUAL_CHEAT_KEYS, ASPECT_RATIO_OPTIONS, MODEL_OPTIONS } from '../constants';
import { Music, Mic2, User, Type, CheckCircle2, Zap, History, Users, Wand2, X, Square, RectangleVertical, RectangleHorizontal, Smartphone, Monitor, LayoutTemplate, Sparkles, Cpu, Plus, Trash2, ArrowRight } from 'lucide-react';

interface InputFormProps {
  input: SongInput;
  setInput: React.Dispatch<React.SetStateAction<SongInput>>;
  onNext: () => void;
  recentArtists: string[];
}

const InputForm: React.FC<InputFormProps> = ({ input, setInput, onNext, recentArtists }) => {
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(VISUAL_CHEAT_KEYS[0].category);
  const [promptBuffer, setPromptBuffer] = useState<string[]>([]);

  const handleStyleSelect = (style: ArtStyle) => {
    setInput(prev => ({ ...prev, style }));
  };

  const handleCharacterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
        setInput({ ...input, character: val });
    }
  };

  // Add item to buffer
  const handleAddToBuffer = (item: string) => {
    if (!promptBuffer.includes(item)) {
        setPromptBuffer([...promptBuffer, item]);
    }
  };

  // Remove item from buffer
  const handleRemoveFromBuffer = (index: number) => {
      const newBuffer = [...promptBuffer];
      newBuffer.splice(index, 1);
      setPromptBuffer(newBuffer);
  };

  // Apply final prompt to input
  const handleFinalApply = () => {
      const additionalPrompt = promptBuffer.join(', ');
      const current = input.character.trim();
      const separator = current && additionalPrompt ? ', ' : '';
      
      setInput({ 
          ...input, 
          character: current + separator + additionalPrompt 
      });
      
      setPromptBuffer([]);
      setIsCheatSheetOpen(false);
  };

  // Validation: Style is required (always selected by default), Title/Artist are now optional
  const isFormValid = !!input.style.id;

  const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'Square': return <Square size={16} />;
        case 'RectangleVertical': return <RectangleVertical size={16} />;
        case 'RectangleHorizontal': return <RectangleHorizontal size={16} />;
        case 'Smartphone': return <Smartphone size={16} />;
        case 'Monitor': return <Monitor size={16} />;
        default: return <Square size={16} />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 animate-fade-in px-4 md:px-8">
      <div className="max-w-2xl mx-auto mb-8 pt-8">
        <h1 className="text-4xl font-display font-bold text-white mb-2">
          New Album <span className="text-neon-green">Cover</span>
        </h1>
        <p className="text-gray-400">곡 정보를 입력하고 AI로 앨범 아트를 생성하세요.</p>
      </div>

      <div className="space-y-12">
        {/* Text Inputs - Constrained width for better UX */}
        <div className="max-w-2xl mx-auto bg-glass border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-4">
          
          <div className="relative group">
            <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-neon-green transition-colors">
              <Music size={20} />
            </div>
            <input
              type="text"
              placeholder="노래 제목 (Optional)"
              value={input.title}
              onChange={(e) => setInput({ ...input, title: e.target.value })}
              className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all"
            />
          </div>

          <div className="space-y-3">
            <div className="relative group">
                <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-cyber-pink transition-colors">
                <User size={20} />
                </div>
                <input
                type="text"
                placeholder="아티스트 (Optional)"
                value={input.artist}
                onChange={(e) => setInput({ ...input, artist: e.target.value })}
                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-pink focus:shadow-[0_0_10px_rgba(255,0,255,0.3)] transition-all"
                />
            </div>
            
            {/* Recent Artists Chips */}
            {recentArtists.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center pl-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><History size={12}/> Recent:</span>
                    {recentArtists.map((artist, idx) => (
                        <button
                            key={idx}
                            onClick={() => setInput({ ...input, artist })}
                            className="px-2.5 py-1 bg-white/5 hover:bg-cyber-pink/20 hover:text-cyber-pink hover:border-cyber-pink/30 border border-white/10 rounded-md text-xs text-gray-300 transition-all duration-200"
                        >
                            {artist}
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* Feature: Text Generation Toggle */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-neon-green">
                    <LayoutTemplate size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">AI 텍스트 생성 (AI Text Generation)</h4>
                    <p className="text-xs text-gray-400">AI가 이미지 안에 제목과 아티스트명을 직접 그려넣습니다.</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={input.autoTextOverlay}
                    onChange={(e) => setInput({...input, autoTextOverlay: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
            </label>
          </div>

          {/* Text Behind Character Toggle (Visible only when Auto Text is ON) */}
          {input.autoTextOverlay && (
            <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl ml-4 border-l-4 border-l-neon-green/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-lg text-cyber-pink">
                        <Type size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">텍스트 뒤로 배치 (Text Behind Subject) <span className="text-[10px] bg-neon-green text-black px-1.5 py-0.5 rounded ml-1 font-bold">CHEAT KEY</span></h4>
                        <p className="text-xs text-gray-400">인물 뒤에 텍스트를 배치하여 잡지 커버 같은 입체감을 줍니다.</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={input.textBehindCharacter || false}
                        onChange={(e) => setInput({...input, textBehindCharacter: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-pink"></div>
                </label>
            </div>
          )}

          {/* Model Selector */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 mb-1">
                 <Cpu size={16} className="text-gray-400" />
                 <label className="text-sm text-gray-400 font-medium">생성 모델 (AI Model)</label>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MODEL_OPTIONS.map((model) => (
                    <button
                        key={model.id}
                        onClick={() => setInput({ ...input, model: model.id })}
                        className={`
                            relative flex items-center gap-3 p-4 rounded-xl border transition-all text-left
                            ${input.model === model.id
                                ? 'bg-white/10 border-cyber-pink shadow-[0_0_10px_rgba(255,0,255,0.2)]'
                                : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5'}
                        `}
                    >
                        <div className={`p-2 rounded-lg ${input.model === model.id ? 'bg-cyber-pink/20 text-cyber-pink' : 'bg-gray-800 text-gray-400'}`}>
                            <Sparkles size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className={`font-bold text-sm ${input.model === model.id ? 'text-white' : 'text-gray-300'}`}>{model.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${model.badge === 'PRO' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                    {model.badge}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">{model.description}</p>
                        </div>
                        {input.model === model.id && (
                            <div className="text-cyber-pink">
                                <CheckCircle2 size={18} />
                            </div>
                        )}
                    </button>
                ))}
             </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium ml-1">이미지 비율 (Aspect Ratio)</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {ASPECT_RATIO_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setInput({ ...input, aspectRatio: option.value })}
                        className={`
                            flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border transition-all
                            ${input.aspectRatio === option.value 
                                ? 'bg-white/10 border-neon-green text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.2)]' 
                                : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'}
                        `}
                    >
                        {getIcon(option.icon)}
                        <span className="text-[10px] font-bold">{option.value}</span>
                    </button>
                ))}
            </div>
          </div>

          {/* Character Input Section */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 mb-1">
                 <Users size={16} className="text-gray-400" />
                 <label className="text-sm text-gray-400 font-medium">등장인물 (Characters)</label>
             </div>
             
             {/* 1. Dropdown for samples with optgroups */}
             <div className="relative">
                <select
                    onChange={handleCharacterSelect}
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-white/50 cursor-pointer text-sm"
                    defaultValue=""
                >
                    <option value="" disabled>-- 샘플 선택 --</option>
                    {CHARACTER_SAMPLES.map((group, idx) => (
                        <optgroup key={idx} label={group.category} className="bg-gray-800 text-gray-400 font-bold">
                            {group.items.map((char, cIdx) => (
                                <option key={cIdx} value={char} className="bg-gray-900 text-white font-normal pl-4">
                                    {char}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                 <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
             </div>

             {/* 2. Direct Input */}
             <input
                type="text"
                placeholder="직접 입력... (예: 사이버펑크 고양이, 빨간 모자 소녀)"
                value={input.character}
                onChange={(e) => setInput({ ...input, character: e.target.value })}
                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-all"
             />

             {/* 3. Cheat Key Button */}
             <button 
                type="button"
                onClick={() => setIsCheatSheetOpen(true)}
                className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm text-neon-green font-bold hover:from-gray-800 hover:to-gray-800 hover:border-neon-green/50 transition-all shadow-lg shadow-black/20 group"
             >
                <Wand2 size={16} className="group-hover:animate-pulse" />
                ✨ 앨범아트 치트키 (Visual Presets)
             </button>
          </div>

          <div className="space-y-3">
             <div className="relative group">
                <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-white transition-colors">
                <Type size={20} />
                </div>
                <input
                type="text"
                placeholder="장르 (직접 입력 또는 아래 태그 선택)"
                value={input.genre}
                onChange={(e) => setInput({ ...input, genre: e.target.value })}
                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/50 transition-all"
                />
            </div>
            
            {/* Genre Chips */}
            <div className="flex flex-wrap gap-2">
                {MUSIC_GENRES.map((g) => (
                    <button
                        key={g}
                        onClick={() => setInput({...input, genre: g})}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                           ${input.genre === g 
                             ? 'bg-neon-green/20 text-neon-green border-neon-green shadow-[0_0_10px_rgba(57,255,20,0.2)]' 
                             : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'
                           }`}
                    >
                        {g}
                    </button>
                ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-neon-green transition-colors">
              <Mic2 size={20} />
            </div>
            <textarea
              placeholder="가사 한 구절 또는 곡의 분위기 (Lyrics/Vibe)"
              value={input.lyrics}
              onChange={(e) => setInput({ ...input, lyrics: e.target.value })}
              rows={3}
              className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all resize-none"
            />
          </div>
        </div>

        {/* Style Selector - Widen to full container */}
        <div>
          <h3 className="text-lg font-display text-white mb-6 flex items-center gap-2 max-w-2xl mx-auto lg:mx-0">
            <span className="w-2 h-8 bg-cyber-pink rounded-full"></span>
            Select Art Style
          </h3>
          {/* Changed layout: Grid instead of Flex Scroll, full width */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ART_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style)}
                className={`
                  relative w-full aspect-[3/4] rounded-2xl p-4 text-left flex flex-col justify-end overflow-hidden group transition-all duration-300
                  border-2 ${input.style?.id === style.id ? 'border-neon-green scale-105 z-10 shadow-[0_0_20px_rgba(57,255,20,0.4)]' : 'border-white/10 hover:border-white/30 hover:scale-105 hover:z-10'}
                `}
              >
                {/* Background Gradient Preview */}
                <div className={`absolute inset-0 bg-gradient-to-br ${style.previewColor} opacity-20 group-hover:opacity-30 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Selection Indicator */}
                {input.style?.id === style.id && (
                  <div className="absolute top-3 right-3 text-neon-green">
                    <CheckCircle2 size={24} fill="black" />
                  </div>
                )}

                <div className="relative z-10">
                  <span className="text-xs font-mono text-gray-400 mb-1 block">{style.id.toUpperCase()}</span>
                  <h4 className="text-lg md:text-xl font-bold text-white mb-1 leading-tight">{style.name}</h4>
                  <p className="hidden md:block text-xs text-gray-300 line-clamp-2 opacity-70 group-hover:opacity-100 transition-opacity">{style.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onNext}
            disabled={!isFormValid}
            className={`
              w-full py-4 rounded-xl font-display font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300
              ${isFormValid 
                ? 'bg-neon-green text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-1' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
            `}
          >
            <Zap className={isFormValid ? "fill-black" : ""} size={24} />
            GENERATE ARTWORK
          </button>
        </div>
      </div>

      {/* Improved Cheat Sheet Modal */}
      {isCheatSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCheatSheetOpen(false)}></div>
            <div className="relative w-full max-w-5xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden animate-fade-in">
                
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#151515]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-neon-green/20 to-blue-500/20 rounded-lg">
                             <Wand2 size={20} className="text-neon-green" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Visual Prompt Builder</h3>
                            <p className="text-xs text-gray-400">카테고리를 선택하고 키워드를 조합하여 나만의 프롬프트를 만드세요.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsCheatSheetOpen(false)}
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Categories */}
                    <div className="w-1/3 md:w-64 bg-black/30 border-r border-white/10 p-3 overflow-y-auto">
                        <div className="space-y-1">
                            {VISUAL_CHEAT_KEYS.map((cat) => (
                                <button
                                    key={cat.category}
                                    onClick={() => setSelectedCategory(cat.category)}
                                    className={`
                                        w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all
                                        ${selectedCategory === cat.category 
                                            ? 'bg-white/10 text-neon-green border-l-2 border-neon-green' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}
                                    `}
                                >
                                    {cat.category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col bg-[#0a0a0a]">
                        <div className="flex-1 p-6 overflow-y-auto">
                            <h4 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                                <span className="text-neon-green">Select</span> Keywords
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {VISUAL_CHEAT_KEYS.find(c => c.category === selectedCategory)?.items.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAddToBuffer(item)}
                                        className={`
                                            text-left p-4 rounded-xl border transition-all group relative overflow-hidden
                                            ${promptBuffer.includes(item) 
                                                ? 'bg-neon-green/10 border-neon-green shadow-[0_0_10px_rgba(57,255,20,0.1)]' 
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'}
                                        `}
                                    >
                                        <div className="flex justify-between items-center relative z-10">
                                            <span className={`text-sm ${promptBuffer.includes(item) ? 'text-white font-bold' : 'text-gray-300'}`}>
                                                {item}
                                            </span>
                                            {promptBuffer.includes(item) ? (
                                                <CheckCircle2 size={16} className="text-neon-green" />
                                            ) : (
                                                <Plus size={16} className="text-gray-600 group-hover:text-white" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Prompt Buffer & Apply Bar */}
                        <div className="p-4 bg-[#111] border-t border-white/10 shadow-lg z-10">
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs text-gray-400 font-mono">YOUR PROMPT MIX</label>
                                    <span className="text-xs text-gray-500">{promptBuffer.length} items selected</span>
                                </div>
                                
                                {promptBuffer.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-black/50 rounded-lg border border-white/5">
                                        {promptBuffer.map((tag, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 border border-white/10 rounded-md text-xs text-gray-200 animate-scale-up">
                                                {tag}
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveFromBuffer(idx); }}
                                                    className="hover:text-red-400 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-12 flex items-center justify-center text-gray-600 text-sm italic bg-black/30 rounded-lg border border-white/5 border-dashed">
                                        Select keywords from the list above...
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setPromptBuffer([])}
                                    disabled={promptBuffer.length === 0}
                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Clear All"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={handleFinalApply}
                                    disabled={promptBuffer.length === 0}
                                    className="flex-1 py-3 bg-neon-green text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
                                >
                                    Apply Prompt to Input <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InputForm;