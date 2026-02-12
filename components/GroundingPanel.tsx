
import React from 'react';
import { GroundingChunk } from '../types';

interface GroundingPanelProps {
  chunks: GroundingChunk[];
  onClear: () => void;
}

const GroundingPanel: React.FC<GroundingPanelProps> = ({ chunks, onClear }) => {
  if (chunks.length === 0) return null;

  return (
    <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Insights & Sources</h3>
        </div>
        <button onClick={onClear} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">Dismiss</button>
      </div>
      <div className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide">
        {chunks.map((chunk, idx) => chunk.web && (
          <a 
            key={idx} 
            href={chunk.web.uri || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-shrink-0 w-64 p-4 bg-white border border-blue-50 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="text-[9px] font-bold text-blue-500 uppercase mb-1 flex items-center justify-between">
              Source
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <h4 className="font-bold text-[#1E293B] line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
              {chunk.web.title || 'Untitled Source'}
            </h4>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GroundingPanel;
