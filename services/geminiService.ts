
import { GoogleGenAI, Type } from "@google/genai";
import type { FoodItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not found");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const menuSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The name of the food item.",
      },
      description: {
        type: Type.STRING,
        description: "A brief, appetizing description of the food item.",
      },
      price: {
        type: Type.NUMBER,
        description: "The price of the item in USD.",
      },
      category: {
        type: Type.STRING,
        description: "The category of the food item (e.g., 'Appetizers', 'Main Courses', 'Desserts', 'Drinks').",
      },
    },
    required: ["name", "description", "price", "category"],
  },
};

export async function generateMenu(): Promise<Omit<FoodItem, 'id' | 'image'>[]> {
  try {
    const prompt = `Generate a diverse and appealing menu for a modern bistro restaurant. Provide exactly 12 items.
    The menu should be well-balanced across these four categories: 'Appetizers', 'Main Courses', 'Desserts', and 'Drinks'.
    Ensure each item has a name, a short, mouth-watering description, a price, and its category.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: menuSchema,
      },
    });

    const jsonText = response.text.trim();
    const menu = JSON.parse(jsonText);
    
    // Basic validation to ensure we got an array
    if (!Array.isArray(menu)) {
        throw new Error("API did not return a valid menu array.");
    }
    
    return menu;

  } catch (error) {
    console.error("Error generating menu with Gemini:", error);
    throw new Error("Failed to fetch menu from the AI. Please check the API key and network connection.");
  }
}
