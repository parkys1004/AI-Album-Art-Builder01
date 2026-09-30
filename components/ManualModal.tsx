import React from 'react';
import { X, BookOpen, Sparkles, Sliders, Type, Image as ImageIcon, Download } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <Sparkles className="text-neon-green" size={24} />,
      title: "1. 기본 정보 입력",
      desc: "노래 제목, 아티스트, 장르, 가사(분위기)를 입력하세요. 구체적인 가사나 분위기를 적으면 AI가 더 정확한 이미지를 그려줍니다."
    },
    {
      icon: <Sliders className="text-cyber-pink" size={24} />,
      title: "2. 스타일 및 모델 선택",
      desc: "원하는 아트 스타일을 선택하세요. 'AI 모델'에서 속도가 빠른 [Nano Banana]와 고화질인 [Nano Banana Pro] 중 선택할 수 있습니다."
    },
    {
      icon: <Type className="text-blue-400" size={24} />,
      title: "3. 텍스트 설정",
      desc: "'AI 텍스트 생성'을 켜면 이미지를 그릴 때 제목을 포함해서 그립니다. 끄면 글자가 없는 깨끗한 이미지가 생성됩니다."
    },
    {
      icon: <ImageIcon className="text-yellow-400" size={24} />,
      title: "4. 이미지 생성 및 편집",
      desc: "[GENERATE] 버튼을 눌러 이미지를 생성하세요. 생성 후 편집기(Editor)에서 텍스트의 폰트, 위치, 효과(네온, 그림자 등)를 수정할 수 있습니다."
    },
    {
      icon: <Download className="text-purple-400" size={24} />,
      title: "5. 저장 및 갤러리",
      desc: "완성된 이미지는 [Save]하여 갤러리에 보관하거나 [Download]하여 기기에 저장하세요. 'My Studio'에서 언제든 다시 볼 수 있습니다."
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(57,255,20,0.15)] flex flex-col max-h-[85vh] animate-scale-up">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a0a0a] z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-green/10 rounded-lg">
                <BookOpen className="text-neon-green" size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">
              NeonArt <span className="text-gray-400 font-sans text-lg font-normal">User Guide</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 bg-white/5 rounded-full hover:bg-white/20"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-colors">
                    <div className="shrink-0 mt-1">
                        {step.icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                </div>
            ))}

            <div className="mt-8 p-4 bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-xl">
                <h4 className="font-bold text-neon-green mb-2 flex items-center gap-2">
                    💡 Pro Tip: 치트키 사용법
                </h4>
                <p className="text-sm text-gray-300">
                    입력폼 하단의 <span className="font-bold text-white">✨ 앨범아트 치트키</span> 버튼을 눌러보세요. 
                    전문가들이 사용하는 고퀄리티 프롬프트(조명, 분위기, 배경 등)를 클릭 한 번으로 추가할 수 있습니다.
                </p>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#0a0a0a] rounded-b-2xl">
            <button
                onClick={onClose}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
            >
                알겠습니다 (Got it)
            </button>
        </div>
      </div>
      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 0.2s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ManualModal;