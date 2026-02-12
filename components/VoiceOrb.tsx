
import React from 'react';

interface VoiceOrbProps {
  isListening: boolean;
  isAIThinking: boolean;
  isActive: boolean;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ isListening, isAIThinking, isActive }) => {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Background Glow */}
      <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
        isActive 
          ? isListening ? 'bg-red-400/40' : 'bg-indigo-400/40'
          : 'bg-gray-200/20'
      }`} />
      
      {/* Outer Pulse Rings */}
      {isListening && (
        <div className="absolute inset-0 border-4 border-red-500/20 rounded-full animate-ping" />
      )}
      
      {/* The Core Orb */}
      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
        isActive 
          ? isListening ? 'bg-red-500 scale-110' : 'bg-indigo-600'
          : 'bg-gray-300'
      }`}>
        {isAIThinking ? (
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
          </div>
        ) : (
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default VoiceOrb;
