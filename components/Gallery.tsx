import React from 'react';
import { GeneratedAlbumArt } from '../types';
import { Plus, Download, Trash2, Edit2 } from 'lucide-react';

interface GalleryProps {
  items: GeneratedAlbumArt[];
  onNew: () => void;
  onEdit: (item: GeneratedAlbumArt) => void;
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onNew, onEdit, onDelete }) => {
  return (
    <div className="w-full max-w-6xl mx-auto pb-24 px-4 md:px-0 animate-fade-in">
      <div className="flex justify-between items-end mb-8 pt-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            My <span className="text-cyber-pink">Studio</span>
          </h1>
          <p className="text-gray-400">당신이 만든 걸작들을 확인하세요.</p>
        </div>
        <button
          onClick={onNew}
          className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-neon-green transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Plus size={32} className="text-gray-500"/>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No albums yet</h3>
            <p className="text-gray-400 mb-6">Create your first AI album art today.</p>
            <button
                onClick={onNew}
                className="px-8 py-3 bg-neon-green text-black rounded-xl font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all"
            >
                Start Creating
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            // Calculate safe filename
            const safeTitle = item.input.title.trim().replace(/[\\/:*?"<>|]/g, "");
            const fileName = safeTitle ? safeTitle : `neonart-${item.id}`;
            
            return (
            <div key={item.id} className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-white/10 hover:border-cyber-pink/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {/* Image */}
              <div className="aspect-square relative overflow-hidden">
                <img 
                    src={item.finalImage || item.imageUrl} 
                    alt={item.input.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                     <button
                        onClick={() => onEdit(item)}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-cyber-pink hover:text-white transition-colors"
                        title="Edit Design"
                    >
                        <Edit2 size={20} />
                    </button>
                    <a 
                        href={item.finalImage || item.imageUrl} 
                        download={`${fileName}.jpg`}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-neon-green hover:text-black transition-colors"
                        title="Download"
                    >
                        <Download size={20} />
                    </a>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
              </div>
              
              {/* Info */}
              <div className="p-4 bg-gradient-to-b from-gray-900 to-black">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-white truncate pr-2">{item.input.title}</h3>
                    <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono text-gray-300 uppercase">
                        {item.input.style.id}
                    </span>
                </div>
                <p className="text-sm text-cyber-pink font-medium truncate">{item.input.artist}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-1">{item.input.genre} • {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default Gallery;