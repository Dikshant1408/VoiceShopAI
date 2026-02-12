
import React from 'react';
import { RecipeSuggestion } from '../types';

interface RecipeScoutProps {
  recipe: RecipeSuggestion | null;
  loading: boolean;
  onScout: () => void;
  onAddMissing: (items: string[]) => void;
}

const RecipeScout: React.FC<RecipeScoutProps> = ({ recipe, loading, onScout, onAddMissing }) => {
  return (
    <div className="mb-12">
      {!recipe ? (
        <button 
          onClick={onScout}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-xl shadow-indigo-200 text-white flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-black text-sm uppercase tracking-widest">
            {loading ? 'Analyzing Basket...' : 'Recipe Scout'}
          </span>
        </button>
      ) : (
        <div className="bg-white border border-indigo-50 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-100 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
             <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
               Chef Suggestion
             </div>
             <button onClick={() => onScout()} className="text-gray-300 hover:text-indigo-600 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
               </svg>
             </button>
          </div>
          <h3 className="text-3xl font-black text-[#1E293B] mb-2 tracking-tighter leading-none">{recipe.title}</h3>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">{recipe.description}</p>
          
          <div className="space-y-4">
             <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Missing Ingredients</span>
             </div>
             <div className="flex flex-wrap gap-2">
               {recipe.missingIngredients.map((ing, idx) => (
                 <button 
                   key={idx}
                   onClick={() => onAddMissing([ing])}
                   className="px-4 py-2 bg-gray-50 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold text-gray-600 border border-gray-100 transition-all flex items-center space-x-2"
                 >
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                   </svg>
                   <span>{ing}</span>
                 </button>
               ))}
               <button 
                 onClick={() => onAddMissing(recipe.missingIngredients)}
                 className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest"
               >
                 Add All
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeScout;
