import React, { useState } from 'react';
import { SongInput, AppState, GeneratedAlbumArt, EditorState } from './types';
import { ART_STYLES } from './constants';
import InputForm from './components/InputForm';
import LoadingScreen from './components/LoadingScreen';
import Editor from './components/Editor';
import Gallery from './components/Gallery';
import ConfirmModal from './components/ConfirmModal';
import ManualModal from './components/ManualModal';
import ApiKeyModal from './components/ApiKeyModal';
import { generateOptimizedPrompt, generateImage } from './services/geminiService';
import { loadGalleryItems, saveGalleryItems } from './services/storageService';
import { Disc, BookOpen, Settings } from 'lucide-react';

const INITIAL_INPUT: SongInput = {
  title: '',
  artist: '',
  genre: '',
  lyrics: '',
  style: ART_STYLES[0], // Default
  character: '',
  aspectRatio: '1:1', // Default ratio
  autoTextOverlay: true, // Default: Auto-generate text overlay
  textBehindCharacter: false, // Default: Text in front
  model: 'gemini-2.5-flash-image', // Default Model: Nano Banana
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [input, setInput] = useState<SongInput>(INITIAL_INPUT);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // State for editing session
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [isEditingFromGallery, setIsEditingFromGallery] = useState(false);

  // Manual Modal State
  const [isManualOpen, setIsManualOpen] = useState(false);
  
  // API Key Modal State
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Initialize gallery from local storage
  const [galleryItems, setGalleryItems] = useState<GeneratedAlbumArt[]>(() => {
    return loadGalleryItems();
  });

  // Initialize recent artists from local storage
  const [recentArtists, setRecentArtists] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('neonart_recent_artists');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }
    return [];
  });

  const [loadingStatus, setLoadingStatus] = useState('');
  
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: string | null}>({
    isOpen: false,
    id: null
  });

  const handleGenerate = async () => {
    setAppState(AppState.GENERATING);
    setLoadingStatus('Initializing AI models...');

    try {
      // 1. Prompt Engineering
      setLoadingStatus('Optimizing artistic prompt with Gemini...');
      const optimizedPrompt = await generateOptimizedPrompt(input);
      console.log('Optimized Prompt:', optimizedPrompt);

      // 2. Image Generation
      // Pass the selected model from input.model
      setLoadingStatus(`Painting in ${input.style.name} style (${input.aspectRatio})...`);
      const base64Image = await generateImage(optimizedPrompt, input.aspectRatio, input.model);

      if (base64Image) {
        // Save artist to recent list
        if (input.artist.trim()) {
            const newArtist = input.artist.trim();
            setRecentArtists(prev => {
                const filtered = prev.filter(a => a !== newArtist);
                const updated = [newArtist, ...filtered].slice(0, 10); // Keep top 10
                localStorage.setItem('neonart_recent_artists', JSON.stringify(updated));
                return updated;
            });
        }

        // AUTO SAVE: Create draft item immediately
        const newItem: GeneratedAlbumArt = {
            id: Date.now().toString(),
            imageUrl: base64Image,
            input: input,
            createdAt: Date.now(),
            // finalImage starts undefined
        };
        
        const newItems = [newItem, ...galleryItems];
        // Use the safe save method that handles quota limits
        const savedItems = saveGalleryItems(newItems);
        setGalleryItems(savedItems);

        setGeneratedImage(base64Image);
        setCurrentEditingId(newItem.id);
        setIsEditingFromGallery(false);
        setAppState(AppState.EDITOR);
      } else {
        alert("이미지 생성에 실패했습니다. API Key를 확인하거나 잠시 후 다시 시도해주세요.");
        setAppState(AppState.INPUT);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = (error as Error).message;
      alert("오류가 발생했습니다: " + errorMessage);
      
      if (errorMessage.includes('API Key') || errorMessage.includes('Permission Denied') || errorMessage.includes('403')) {
          setIsApiKeyModalOpen(true);
      }
      
      setAppState(AppState.INPUT);
    }
  };

  const handleSave = (finalImage: string, editorState: EditorState) => {
    let updatedItems = [];
    
    if (currentEditingId) {
        // Update existing item
        updatedItems = galleryItems.map(item => 
            item.id === currentEditingId 
                ? { ...item, finalImage: finalImage, editorState: editorState }
                : item
        );
    } else {
        // Fallback (should not typically happen with new flow)
        const newItem: GeneratedAlbumArt = {
          id: Date.now().toString(),
          imageUrl: generatedImage!,
          finalImage: finalImage,
          input: input,
          createdAt: Date.now(),
          editorState: editorState,
        };
        updatedItems = [newItem, ...galleryItems];
    }

    // Use the safe save method that handles quota limits
    const savedItems = saveGalleryItems(updatedItems);
    setGalleryItems(savedItems);
    
    // Check if the current item was dropped due to quota (unlikely as we prioritize new/updated, but possible if it's huge)
    // Actually saveGalleryItems drops from the END (oldest), so the new one should be safe unless it's larger than the entire quota alone.

    setAppState(AppState.GALLERY);
    // Reset state
    setCurrentEditingId(null);
    setIsEditingFromGallery(false);
    
    // Reset input for next time if we were just generating
    if (!isEditingFromGallery) {
        setInput({ ...INITIAL_INPUT, style: input.style });
    }
  };

  const handleEditFromGallery = (item: GeneratedAlbumArt) => {
      setInput(item.input);
      setGeneratedImage(item.imageUrl); // Edit the raw image
      setCurrentEditingId(item.id);
      setIsEditingFromGallery(true);
      setAppState(AppState.EDITOR);
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.id) {
        const newItems = galleryItems.filter(item => item.id !== deleteModal.id);
        setGalleryItems(newItems);
        try {
            localStorage.setItem('neonart_gallery', JSON.stringify(newItems));
        } catch (e) {
            console.error("Failed to update storage", e);
        }
    }
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, id: null });
  };

  const navigateToInput = () => {
    setAppState(AppState.INPUT);
    setGeneratedImage(null);
    setCurrentEditingId(null);
    setIsEditingFromGallery(false);
  };

  const handleEditorBack = () => {
      if (isEditingFromGallery) {
          setAppState(AppState.GALLERY);
          setCurrentEditingId(null);
          setIsEditingFromGallery(false);
      } else {
          setAppState(AppState.INPUT);
          // If backing out from a fresh generation, we don't necessarily delete the auto-saved item,
          // as per "Auto save generated images" requirement. It remains in history as a draft.
          setCurrentEditingId(null);
      }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white selection:bg-neon-green selection:text-black font-sans flex flex-col">
      {/* Header - Only show if not in Editor mode for cleaner workspace */}
      {appState !== AppState.EDITOR && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={navigateToInput}
            >
              <div className="relative">
                <Disc className="text-white group-hover:text-neon-green transition-colors animate-spin-slow" size={24} />
                <div className="absolute inset-0 bg-neon-green blur-md opacity-20 group-hover:opacity-50 transition-opacity"></div>
              </div>
              <span className="font-display font-bold text-xl tracking-wider">NEON<span className="text-neon-green">ART</span></span>
            </div>
            
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsManualOpen(true)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10"
                >
                    <BookOpen size={16} />
                    <span className="hidden md:inline">Guide</span>
                </button>
                
                <button
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10"
                    title="API Key Settings"
                >
                    <Settings size={16} />
                    <span className="hidden md:inline">Key</span>
                </button>

                {appState !== AppState.GALLERY && (
                    <button 
                        onClick={() => setAppState(AppState.GALLERY)}
                        className="text-sm font-bold text-gray-400 hover:text-white transition-colors ml-2"
                    >
                        MY STUDIO
                    </button>
                )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${appState !== AppState.EDITOR ? 'pt-20' : ''} flex flex-col relative`}>
        
        {/* Ambient Background Effects */}
        {appState !== AppState.EDITOR && (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
        )}

        <div className="relative z-10 flex-1 flex flex-col">
          {appState === AppState.INPUT && (
            <InputForm 
              input={input} 
              setInput={setInput} 
              onNext={handleGenerate} 
              recentArtists={recentArtists}
            />
          )}

          {appState === AppState.GENERATING && (
            <LoadingScreen status={loadingStatus} />
          )}

          {appState === AppState.EDITOR && generatedImage && (
            <Editor 
              generatedImage={generatedImage} 
              input={input}
              initialState={galleryItems.find(item => item.id === currentEditingId)?.editorState}
              onSave={handleSave}
              onBack={handleEditorBack}
            />
          )}

          {appState === AppState.GALLERY && (
            <Gallery 
              items={galleryItems} 
              onNew={navigateToInput} 
              onEdit={handleEditFromGallery} 
              onDelete={handleDeleteRequest}
            />
          )}
        </div>
      </main>

      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={handleCancelDelete} 
        onConfirm={handleConfirmDelete} 
        title="Delete Artwork"
        message="Are you sure you want to delete this artwork? This action cannot be undone."
      />

      <ManualModal 
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="text-gray-500 text-sm font-mono">
              © 2026 NEONART AI STUDIO. ALL RIGHTS RESERVED.
            </div>
            <div className="text-gray-400 text-sm font-display">
              Produced by <span className="text-neon-green font-black tracking-tighter text-lg bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/20 shadow-[0_0_10px_rgba(57,255,20,0.2)]">5barTV</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;