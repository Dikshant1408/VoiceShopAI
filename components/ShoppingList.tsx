
import React, { memo } from 'react';
import { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ListItem = memo(({ item, onToggle, onRemove }: { item: ShoppingItem, onToggle: (id: string) => void, onRemove: (id: string) => void }) => (
  <div className={`group flex items-center justify-between p-4 bg-white hover:bg-indigo-50/10 transition-all duration-200 border-b border-gray-50 last:border-0 ${item.checked ? 'opacity-50' : ''}`}>
    <div className="flex items-center space-x-4 flex-1 cursor-pointer" onClick={() => onToggle(item.id)}>
      <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${
        item.checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 group-hover:border-indigo-400'
      }`}>
        {item.checked && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div>
        <h3 className={`font-bold text-[#1E293B] capitalize ${item.checked ? 'line-through text-gray-400' : ''}`}>{item.name}</h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.quantity} • {item.category}</p>
      </div>
    </div>
    <button 
      onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
));

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onToggle, onRemove, onClear }) => {
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-1">List is empty</h3>
        <p className="text-gray-400 font-medium">Try "Hey, add milk and bread"</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-40">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">
          {items.filter(i => !i.checked).length} items remaining
        </h2>
        <button onClick={onClear} className="text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest">Clear List</button>
      </div>

      {Object.entries(groupedItems).sort().map(([category, categoryItems]: [string, ShoppingItem[]]) => (
        <div key={category} className="animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center space-x-2 mb-3 px-2">
            <span className="w-1 h-3 bg-indigo-500 rounded-full" />
            <h3 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">{category}</h3>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {categoryItems.map((item) => (
              <ListItem key={item.id} item={item} onToggle={onToggle} onRemove={onRemove} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShoppingList;
