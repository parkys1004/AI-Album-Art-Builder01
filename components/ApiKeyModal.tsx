import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, ShieldAlert, Save, Loader2, Trash2 } from 'lucide-react';
import { saveApiKey, getDecryptedApiKey, clearApiKey, hasSavedApiKey } from '../services/storageService';
import { testApiKeyConnection } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = getDecryptedApiKey();
      if (saved) {
        setApiKey(saved);
        setHasSaved(true);
      } else {
        setApiKey('');
        setHasSaved(false);
      }
      setStatus('idle');
      setStatusMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setStatus('error');
      setStatusMsg('API Key를 입력해주세요.');
      return;
    }

    setStatus('testing');
    setStatusMsg('연결 테스트 중...');
    
    const isSuccess = await testApiKeyConnection(apiKey);
    
    if (isSuccess) {
      setStatus('success');
      setStatusMsg('연결 성공! 유효한 API Key입니다.');
    } else {
      setStatus('error');
      setStatusMsg('연결 실패. API Key를 확인해주세요.');
    }
  };

  const handleSave = () => {
    if (status !== 'success') {
        // If not tested yet, force a test before saving, or warn user?
        // Let's allow saving but warn if not tested, but typically test first is better.
        // For UX, let's just save.
    }
    saveApiKey(apiKey);
    setHasSaved(true);
    setStatus('success');
    setStatusMsg('로컬 드라이브에 안전하게 저장되었습니다.');
    setTimeout(() => {
        onClose();
    }, 1500);
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey('');
    setHasSaved(false);
    setStatus('idle');
    setStatusMsg('저장된 키가 삭제되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-fade-in" 
        onClick={onClose}
      />

      <div className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-scale-up overflow-hidden">
        {/* Header */}
        <div className="bg-white/5 p-6 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                    <Key size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">API Key Manager</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-200">
                <p>
                    <strong>보안 안내:</strong> 입력하신 API Key는 서버로 전송되지 않으며, 
                    간단한 암호화 과정을 거쳐 사용자의 로컬 브라우저 저장소(Local Storage)에만 저장됩니다.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 block">Gemini API Key</label>
                <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => {
                        setApiKey(e.target.value);
                        setStatus('idle');
                    }}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors font-mono"
                />
            </div>

            {/* Status Indicator */}
            {status !== 'idle' && (
                <div className={`flex items-center gap-2 text-sm font-bold animate-pulse
                    ${status === 'testing' ? 'text-blue-400' : ''}
                    ${status === 'success' ? 'text-neon-green' : ''}
                    ${status === 'error' ? 'text-red-500' : ''}
                `}>
                    {status === 'testing' && <Loader2 size={16} className="animate-spin" />}
                    {status === 'success' && <ShieldCheck size={16} />}
                    {status === 'error' && <ShieldAlert size={16} />}
                    <span>{statusMsg}</span>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    onClick={handleTestConnection}
                    className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    <ShieldCheck size={18} />
                    Test Connection
                </button>
                <button
                    onClick={handleSave}
                    disabled={!apiKey}
                    className="flex-1 py-3 bg-neon-green text-black rounded-xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={18} />
                    Save Key
                </button>
            </div>

            {hasSaved && (
                <button 
                    onClick={handleClear}
                    className="w-full py-2 text-xs text-red-500 hover:text-red-400 underline decoration-red-500/30 hover:decoration-red-400 flex items-center justify-center gap-1"
                >
                    <Trash2 size={12} /> 저장된 키 삭제 (Clear Local Key)
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
