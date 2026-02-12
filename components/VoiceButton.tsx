
import React, { useState, useCallback } from 'react';
import { speechService } from '../services/speechService';

interface VoiceButtonProps {
  onCommand: (text: string) => void;
  isProcessing: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ onCommand, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');

  const toggleListening = useCallback(() => {
    if (isListening) {
      speechService.stop();
      setIsListening(false);
    } else {
      setInterimText('');
      speechService.start(
        (text, isFinal) => {
          setInterimText(text);
          if (isFinal) {
            onCommand(text);
            setIsListening(false);
          }
        },
        () => setIsListening(false),
        (err) => {
          console.error(err);
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  }, [isListening, onCommand]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      {isListening && (
        <div className="mb-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm font-medium text-indigo-600">Listening: <span className="text-gray-600">"{interimText || '...'}"</span></p>
        </div>
      )}
      
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
          isListening 
            ? 'bg-red-500 scale-110' 
            : isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isProcessing ? (
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className={`w-10 h-10 text-white ${isListening ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
      
      <p className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">
        {isListening ? 'Stop' : isProcessing ? 'Processing' : 'Tap to speak'}
      </p>
    </div>
  );
};

export default VoiceButton;
