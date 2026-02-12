
import React, { useState } from 'react';
import { AIResponse, Substitute } from '../types';

interface SuggestionsProps {
  data: AIResponse | null;
  loading: boolean;
  onAdd: (name: string, quantity: number) => void;
}

const SkeletonCard = () => (
  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse flex justify-between">
    <div className="space-y-2 w-3/4">
      <div className="h-2 w-1/4 bg-gray-200 rounded" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
    </div>
    <div className="w-10 h-10 bg-gray-200 rounded-xl" />
  </div>
);

const SubstituteCard: React.FC<{ 
  item: Substitute; 
  onAdd: (name: string, qty: number) => void 
}> = ({ item, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="group/item flex items-center justify-between p-4 bg-teal-50/20 rounded-2xl border border-transparent hover:border-teal-200 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="flex flex-col pr-3 overflow-hidden">
        <span className="text-[9px] text-teal-600 font-black uppercase tracking-widest mb-1 truncate">
          Switch for "{item.original}"
        </span>
        <span className="text-base font-bold text-[#1E293B] leading-tight">
          {item.replacement}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-10 h-10 text-center font-bold text-sm text-teal-700 bg-white border border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
        <button
          onClick={() => onAdd(item.replacement, quantity)}
          className="flex-shrink-0 flex items-center justify-center w-11 h-11 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-200 hover:bg-teal-700 hover:scale-105 active:scale-95 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Suggestions: React.FC<SuggestionsProps> = ({ data, loading, onAdd }) => {
  if (loading) {
    return (
      <div className="mb-12 space-y-6">
        <div className="h-6 w-32 bg-gray-100 rounded-full animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const hasSuggestions = data.suggestions?.length > 0;
  const hasSeasonal = data.seasonal?.length > 0;
  const hasSubstitutes = data.substitutes?.length > 0;

  if (!hasSuggestions && !hasSeasonal && !hasSubstitutes) return null;

  return (
    <div className="mb-12 space-y-12 animate-in fade-in duration-1000">
      {hasSubstitutes && (
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/20 to-indigo-400/20 rounded-[2.2rem] blur opacity-50"></div>
          <div className="relative bg-white rounded-[2rem] p-6 border border-teal-50 shadow-xl shadow-teal-900/5">
            <div className="flex items-center space-x-3 mb-5">
              <div className="flex items-center justify-center w-9 h-9 bg-teal-600 rounded-xl shadow-lg shadow-teal-100">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Smart Substitutes</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.substitutes.map((item, idx) => (
                <SubstituteCard key={idx} item={item} onAdd={onAdd} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {hasSuggestions && (
          <section className="animate-in slide-in-from-left-4 duration-500">
            <div className="flex items-center space-x-3 mb-4 px-1">
              <div className="w-1 h-5 bg-indigo-500 rounded-full" />
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pair it with</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onAdd(s, 1)}
                  className="group px-4 py-2.5 bg-white text-indigo-700 text-sm font-bold rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center space-x-2"
                >
                  <svg className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {hasSeasonal && (
          <section className="animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center space-x-3 mb-4 px-1">
              <div className="w-1 h-5 bg-orange-500 rounded-full" />
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fresh & Seasonal</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.seasonal.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onAdd(s, 1)}
                  className="px-4 py-2.5 bg-white text-orange-700 text-sm font-bold rounded-xl border border-orange-100 hover:bg-orange-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center space-x-2"
                >
                  <span className="text-base leading-none">✨</span>
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
