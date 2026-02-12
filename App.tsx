
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import VoiceOrb from './components/VoiceOrb';
import ShoppingList from './components/ShoppingList';
import Suggestions from './components/Suggestions';
import CameraScanner from './components/CameraScanner';
import GroundingPanel from './components/GroundingPanel';
import RecipeScout from './components/RecipeScout';
import SearchModal from './components/SearchModal';
import LanguageSelector from './components/LanguageSelector';
import { ShoppingItem, AIResponse, ToastState, GroundingChunk, RecipeSuggestion, Product } from './types';
import { connectLive, analyzeImage, getSmartSuggestions, suggestMeal } from './services/geminiService';
import { searchService, SearchFilters } from './services/searchService';
import { createBlob, decode, decodeAudioData } from './services/audioHelpers';
import { Type, LiveServerMessage } from '@google/genai';

const App: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shopping_list_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [suggestions, setSuggestions] = useState<AIResponse | null>(null);
  const [recipe, setRecipe] = useState<RecipeSuggestion | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [lastPriceFilter, setLastPriceFilter] = useState<{ min?: number; max?: number }>({});
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  
  // Use a ref for items to avoid stale closures in high-frequency Live API callbacks
  const itemsRef = useRef<ShoppingItem[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    localStorage.setItem('shopping_list_v2', JSON.stringify(items));
    if (items.length > 0) {
      getSmartSuggestions(items).then(setSuggestions).catch(console.error);
    } else {
      setSuggestions(null);
      setRecipe(null);
    }
  }, [items]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const addItem = useCallback((name: string, quantity: string | number = "1", category: string = "Pantry") => {
    setItems(prev => {
      const newItem: ShoppingItem = {
        id: crypto.randomUUID(),
        name,
        quantity,
        category,
        checked: false,
        timestamp: Date.now()
      };
      return [newItem, ...prev];
    });
  }, []);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleScout = async () => {
    setIsAIThinking(true);
    try {
      const res = await suggestMeal(items);
      setRecipe(res);
    } catch (e) {
      showToast("Scout failed", "error");
    } finally {
      setIsAIThinking(false);
    }
  };

  const handleVoiceSearch = useCallback((searchText: string) => {
    const filters = searchService.parseVoiceSearch(searchText);
    const results = searchService.search(filters);
    
    setSearchResults(results);
    setLastSearchQuery(filters.keyword || searchText);
    setLastPriceFilter({ min: filters.minPrice, max: filters.maxPrice });
    setShowSearchModal(true);
    
    showToast(`Found ${results.length} products`, 'info');
  }, [showToast]);

  const handleAddFromSearch = useCallback((product: Product) => {
    addItem(product.name, 1, product.category);
    showToast(`Added ${product.name}`, 'success');
    setShowSearchModal(false);
  }, [addItem, showToast]);

  // Fix handleScan implementation for camera capture processing
  const handleScan = async (base64: string) => {
    setIsScanning(false);
    setIsAIThinking(true);
    try {
      const result = await analyzeImage(base64);
      if (result.items && result.items.length > 0) {
        result.items.forEach(item => {
          addItem(item.name, item.quantity, item.category);
        });
        showToast(`Added ${result.items.length} items from scan`, "success");
      } else {
        showToast("No items detected", "info");
      }
    } catch (e) {
      console.error("Scan error:", e);
      showToast("Scan analysis failed", "error");
    } finally {
      setIsAIThinking(false);
    }
  };

  const startLive = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const outputCtx = audioContextRef.current;
      if (outputCtx.state === 'suspended') await outputCtx.resume();
      
      setIsLiveActive(true);
      
      // Use Type constants for tool declarations as per @google/genai guidelines
      const tools = [
        { name: 'add_item', parameters: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, quantity: { type: Type.STRING }, category: { type: Type.STRING } }, required: ['name', 'quantity', 'category'] } },
        { name: 'remove_item', parameters: { type: Type.OBJECT, properties: { name: { type: Type.STRING } }, required: ['name'] } },
        { name: 'clear_list', parameters: { type: Type.OBJECT, properties: {} } },
        { name: 'search_products', parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING } }, required: ['query'] } }
      ];

      let sessionPromise: Promise<any>;

      const callbacks = {
        onopen: () => showToast("AI Live", "success"),
        onmessage: async (message: LiveServerMessage) => {
          // Handle audio interruption: stop all currently playing chunks and reset timing
          if (message.serverContent?.interrupted) {
            for (const source of sourcesRef.current) {
              try { source.stop(); } catch (e) {}
              sourcesRef.current.delete(source);
            }
            nextStartTimeRef.current = 0;
          }

          // Capture Grounding Metadata if present
          if (message.serverContent?.groundingMetadata?.groundingChunks) {
            // Fix type mismatch by using cast to bypass structural typing overlap issues between local and library types
            const chunks = message.serverContent.groundingMetadata.groundingChunks as any as GroundingChunk[];
            setGroundingChunks(prev => [...prev, ...chunks]);
          }

          if (message.toolCall) {
            for (const call of message.toolCall.functionCalls) {
              if (call.name === 'add_item') {
                addItem(call.args.name as string, call.args.quantity as string, call.args.category as string);
                sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: call.id, name: call.name, response: { result: "ok" } } }));
              } else if (call.name === 'clear_list') {
                setItems([]);
                sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: call.id, name: call.name, response: { result: "ok" } } }));
              } else if (call.name === 'remove_item') {
                 const itemName = (call.args.name as string).toLowerCase();
                 const found = itemsRef.current.find(i => i.name.toLowerCase().includes(itemName));
                 if (found) removeItem(found.id);
                 sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: call.id, name: call.name, response: { result: found ? "ok" : "not found" } } }));
              } else if (call.name === 'search_products') {
                 handleVoiceSearch(call.args.query as string);
                 sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: call.id, name: call.name, response: { result: "search completed" } } }));
              }
            }
          }

          // Decode and schedule raw PCM audio chunks for gapless playback
          const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioBase64 && outputCtx) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            const buffer = await decodeAudioData(decode(audioBase64), outputCtx, 24000, 1);
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            
            // Clean up sources as they finish playing
            source.addEventListener('ended', () => {
              sourcesRef.current.delete(source);
            });
            
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
        },
        onerror: (e: any) => {
          console.error("Live connection error:", e);
          setIsLiveActive(false);
        },
        onclose: () => setIsLiveActive(false)
      };

      sessionPromise = connectLive(callbacks, tools);

      // Start microphone stream and feed it to the model turn
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const source = inputCtx.createMediaStreamSource(micStream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Ensure data is sent only after the session promise resolves
        sessionPromise.then(s => s.sendRealtimeInput({ media: createBlob(inputData) }));
      };
      source.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (err: any) {
      showToast("Access Denied", "error");
      setIsLiveActive(false);
    }
  };

  // Improvised Analytics
  const healthScore = Math.min(100, (items.filter(i => ['Produce', 'Dairy & Eggs', 'Meat & Seafood'].includes(i.category)).length / (items.length || 1)) * 100);
  const itemCount = items.filter(i => !i.checked).length;

  return (
    <div className="min-h-screen bg-[#FDFDFE] selection:bg-indigo-100 pb-40">
      <Header />
      
      <main className="max-w-xl mx-auto px-6 pt-12">
        {toast && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4">
            <div className={`px-6 py-3 rounded-full shadow-2xl text-white font-bold text-xs ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-[#1E293B]'
            }`}>
              {toast.message}
            </div>
          </div>
        )}

        <div className="mb-12 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-6xl font-black text-[#1E293B] tracking-tighter mb-2 italic">Basket</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                <span className="text-xs font-black text-[#1E293B]">{itemCount}</span>
              </div>
              <div className="w-px h-3 bg-gray-200" />
              <div className="flex items-center space-x-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vitality Score</span>
                <span className={`text-xs font-black ${healthScore > 50 ? 'text-green-600' : 'text-orange-600'}`}>
                  {healthScore.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <button 
              onClick={() => setIsScanning(true)}
              className="w-14 h-14 bg-white border border-gray-100 shadow-xl rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-indigo-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        <GroundingPanel 
          chunks={groundingChunks} 
          onClear={() => setGroundingChunks([])} 
        />

        <RecipeScout 
          recipe={recipe} 
          loading={isAIThinking} 
          onScout={handleScout} 
          onAddMissing={(missing) => missing.forEach(m => addItem(m))}
        />

        <Suggestions 
          data={suggestions} 
          loading={false}
          onAdd={addItem}
        />

        <ShoppingList 
          items={items} 
          onToggle={toggleItem}
          onRemove={removeItem}
          onClear={() => setItems([])}
        />

        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
           <button onClick={isLiveActive ? undefined : startLive} className="focus:outline-none">
             <VoiceOrb isListening={isLiveActive} isAIThinking={isAIThinking} isActive={isLiveActive} />
           </button>
           <p className="mt-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
             {isLiveActive ? "Pro Active" : "Consult AI"}
           </p>
        </div>

        {isScanning && (
          <CameraScanner 
            onCapture={handleScan} 
            onClose={() => setIsScanning(false)} 
            onError={(msg) => showToast(msg, "error")}
          />
        )}

        {showSearchModal && (
          <SearchModal 
            results={searchResults}
            onClose={() => setShowSearchModal(false)}
            onAdd={handleAddFromSearch}
            searchQuery={lastSearchQuery}
            priceFilter={lastPriceFilter}
          />
        )}
      </main>
    </div>
  );
};

export default App;
