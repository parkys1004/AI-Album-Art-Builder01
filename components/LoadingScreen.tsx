import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  status: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ status }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-neon-green rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="relative bg-deep-black border-2 border-neon-green p-6 rounded-full animate-bounce">
            <Sparkles className="w-12 h-12 text-neon-green animate-spin-slow" />
        </div>
      </div>
      
      <h2 className="text-2xl font-display font-bold text-white mb-4 animate-pulse">
        AI Creating...
      </h2>
      
      <p className="text-neon-green font-mono text-sm border border-neon-green/30 bg-neon-green/10 px-4 py-2 rounded-md">
        {status}
      </p>

      <div className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-neon-green to-cyber-pink w-1/2 animate-slide-loading"></div>
      </div>
      
      <style>{`
        @keyframes slide-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide-loading {
          animation: slide-loading 1.5s infinite linear;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
