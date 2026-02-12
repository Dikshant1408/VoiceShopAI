import { Product } from '../types';
import { MOCK_CATALOG } from '../constants';

export interface SearchFilters {
  keyword?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

export class SearchService {
  private catalog: Product[] = MOCK_CATALOG;

  search(filters: SearchFilters): Product[] {
    let results = [...this.catalog];

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(keyword) || 
        p.brand.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword)
      );
    }

    if (filters.brand) {
      results = results.filter(p => 
        p.brand.toLowerCase() === filters.brand!.toLowerCase()
      );
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.category) {
      results = results.filter(p => 
        p.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    return results;
  }

  parseVoiceSearch(text: string): SearchFilters {
    const filters: SearchFilters = {};
    const lowerText = text.toLowerCase();

    // Extract price range
    const priceMatch = lowerText.match(/under\s+\$?(\d+)/i) || 
                       lowerText.match(/less than\s+\$?(\d+)/i) ||
                       lowerText.match(/below\s+\$?(\d+)/i);
    if (priceMatch) {
      filters.maxPrice = parseFloat(priceMatch[1]);
    }

    const minPriceMatch = lowerText.match(/over\s+\$?(\d+)/i) || 
                          lowerText.match(/more than\s+\$?(\d+)/i) ||
                          lowerText.match(/above\s+\$?(\d+)/i);
    if (minPriceMatch) {
      filters.minPrice = parseFloat(minPriceMatch[1]);
    }

    // Extract brand
    const brands = Array.from(new Set(this.catalog.map(p => p.brand)));
    for (const brand of brands) {
      if (lowerText.includes(brand.toLowerCase())) {
        filters.brand = brand;
        break;
      }
    }

    // Extract keyword (remove price and brand mentions)
    let keyword = text;
    keyword = keyword.replace(/under\s+\$?\d+/gi, '');
    keyword = keyword.replace(/less than\s+\$?\d+/gi, '');
    keyword = keyword.replace(/below\s+\$?\d+/gi, '');
    keyword = keyword.replace(/over\s+\$?\d+/gi, '');
    keyword = keyword.replace(/more than\s+\$?\d+/gi, '');
    keyword = keyword.replace(/above\s+\$?\d+/gi, '');
    keyword = keyword.replace(/find|search|show|get|look for/gi, '');
    if (filters.brand) {
      keyword = keyword.replace(new RegExp(filters.brand, 'gi'), '');
    }
    keyword = keyword.trim();
    
    if (keyword) {
      filters.keyword = keyword;
    }

    return filters;
  }
}

export const searchService = new SearchService();
