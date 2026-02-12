
import { Product } from './types';

export const CATEGORIES = [
  'Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery', 
  'Beverages', 'Frozen', 'Snacks', 'Household', 'Pantry', 'Health & Beauty'
];

export const MOCK_CATALOG: Product[] = [
  { name: 'Organic Red Apples', brand: 'Nature First', price: 4.99, category: 'Produce' },
  { name: 'Whole Milk', brand: 'Dairy Gold', price: 3.49, category: 'Dairy & Eggs' },
  { name: 'Greek Yogurt', brand: 'Chobani', price: 1.25, category: 'Dairy & Eggs' },
  { name: 'Sourdough Bread', brand: 'Local Bakery', price: 5.50, category: 'Bakery' },
  { name: 'Sparkling Water', brand: 'LaCroix', price: 6.99, category: 'Beverages' },
  { name: 'Dark Chocolate', brand: 'Lindt', price: 3.99, category: 'Snacks' },
  { name: 'Toothpaste', brand: 'Colgate', price: 4.50, category: 'Household' },
  { name: 'Whitening Toothpaste', brand: 'Crest', price: 3.20, category: 'Household' },
  { name: 'Almond Milk', brand: 'Silk', price: 4.25, category: 'Dairy & Eggs' },
  { name: 'Organic Bananas', brand: 'Chiquita', price: 1.99, category: 'Produce' },
  { name: 'Avocados', brand: 'Hass', price: 2.50, category: 'Produce' },
  { name: 'Chicken Breast', brand: 'Free Range', price: 12.00, category: 'Meat & Seafood' }
];

export const SYSTEM_INSTRUCTIONS = `
You are a Voice Shopping Assistant for a high-end grocery app. 
Parse user intent from their speech and return structured JSON.

Valid Intents:
- ADD: User wants to add one or more items.
- REMOVE: User wants to take something off the list.
- SEARCH: User is looking for price or availability.
- CLEAR: User wants to empty the whole list.
- UNKNOWN: Intent is unclear.

Schema:
{
  "intent": "ADD" | "REMOVE" | "SEARCH" | "CLEAR" | "UNKNOWN",
  "itemName": string,
  "quantity": string | number,
  "category": string (Must be one of: Produce, Dairy & Eggs, Meat & Seafood, Bakery, Beverages, Frozen, Snacks, Household, Pantry, Health & Beauty),
  "searchFilters": { "keyword": string, "maxPrice": number, "brand": string }
}

Notes:
- If quantity is not mentioned, default to 1.
- For "REMOVE", itemName should be the exact or partial string user said.
- Categorize accurately. 
- Example: "Add 2 packs of blueberries" -> { "intent": "ADD", "itemName": "blueberries", "quantity": "2 packs", "category": "Produce" }
`;
