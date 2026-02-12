
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ShoppingItem, AIResponse, RecipeSuggestion } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function suggestMeal(items: ShoppingItem[]): Promise<RecipeSuggestion | null> {
  if (items.length === 0) return null;
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these items: ${items.map(i => i.name).join(", ")}, suggest one meal. Provide a title, brief description, and a list of 2-3 common ingredients I might be missing.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "missingIngredients"]
      }
    }
  });
  return JSON.parse(response.text || "null");
}

export async function analyzeImage(base64Image: string): Promise<{ items: { name: string, quantity: string, category: string }[] }> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Identify grocery items. Return JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.STRING },
                category: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{"items":[]}');
}

export async function getSmartSuggestions(items: ShoppingItem[]): Promise<AIResponse> {
  if (items.length === 0) return { suggestions: [], substitutes: [], seasonal: [] };
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Shopping list: ${items.map(i => i.name).join(", ")}. Suggest pairs and substitutes.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          substitutes: { 
            type: Type.ARRAY, 
            items: {
              type: Type.OBJECT,
              properties: { original: { type: Type.STRING }, replacement: { type: Type.STRING } }
            }
          },
          seasonal: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || '{"suggestions":[], "substitutes":[], "seasonal":[]}');
}

export const connectLive = (callbacks: any, tools: any[]) => {
  const ai = getAI();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      tools: [{ functionDeclarations: tools }, { googleSearch: {} }],
      systemInstruction: "You are VoiceShop Pro. You are proactive and helpful. When a user adds an item, you can mention tips or search for interesting facts using Google Search. Keep responses brief. Use the provided tools to manage the list."
    }
  });
};
