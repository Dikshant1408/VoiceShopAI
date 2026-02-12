
import React, { useState } from 'react';
import { Product } from '../types';

interface SearchModalProps {
  results: Product[];
  onClose: () => void;
  onAdd: (product: Product) => void;
  searchQuery?: string;
  priceFilter?: { min?: number; max?: number };
}

const SearchModal: React.FC<SearchModalProps> = ({ results, onClose, onAdd, searchQuery, priceFilter }) => {
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [filterBrand, setFilterBrand] = useState<string>('');

  const brands = Array.from(new Set(results.map(p => p.brand)));
  
  let filteredResults = [...results];
  if (filterBrand) {
    filteredResults = filteredResults.filter(p => p.brand === filterBrand);
  }
  if (priceFilter?.min !== undefined) {
    filteredResults = filteredResults.filter(p => p.price >= priceFilter.min!);
  }
  if (priceFilter?.max !== undefined) {
    filteredResults = filteredResults.filter(p => p.price <= priceFilter.max!);
  }
  
  filteredResults.sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Search Results</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {searchQuery && (
            <div className="mb-3 px-3 py-2 bg-indigo-50 rounded-xl text-sm">
              <span className="text-gray-600">Searching for:</span>{' '}
              <span className="font-bold text-indigo-600">{searchQuery}</span>
            </div>
          )}

          <div className="flex gap-2">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
            
            {brands.length > 1 && (
              <select 
                value={filterBrand} 
                onChange={(e) => setFilterBrand(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No matching products found in catalog.
            </div>
          ) : (
            filteredResults.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-900">{product.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">{product.brand} • ${product.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => onAdd(product)}
                  className="px-4 py-2 bg-white text-indigo-600 text-sm font-bold rounded-xl border border-indigo-100 shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Add to List
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
