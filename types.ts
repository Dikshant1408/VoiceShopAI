
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string | number;
  category: string;
  checked: boolean;
  timestamp: number;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface RecipeSuggestion {
  title: string;
  description: string;
  missingIngredients: string[];
}

export interface Substitute {
  original: string;
  replacement: string;
}

export interface AIResponse {
  suggestions: string[];
  substitutes: Substitute[];
  seasonal: string[];
}

export interface Product {
  name: string;
  brand: string;
  price: number;
  category: string;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}
