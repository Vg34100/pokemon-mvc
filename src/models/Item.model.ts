// src/models/Item.model.ts
interface ItemApiResponse {
    id: number;
    name: string;
    cost: number;
    effect_entries: {
      effect: string;
      language: {
        name: string;
      };
    }[];
    sprite: string;
    category: {
      name: string;
    };
  }
  
  export interface Item {
    id: number;
    name: string;
    cost: number;
    effect: string;
    sprite: string;
    category: string;
  }
  
  export class ItemModel {
    async getAllItems(limit: number = 500): Promise<Item[]> {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/item?limit=${limit}`
        );
        const data = await response.json();
        
        const items = await Promise.all(
          data.results.map(async (item: { name: string; url: string }) => {
            const itemResponse = await fetch(item.url);
            const itemData: ItemApiResponse = await itemResponse.json();
  
            const englishEffect = itemData.effect_entries.find(
              entry => entry.language.name === "en"
            );
  
            return {
              id: itemData.id,
              name: itemData.name,
              cost: itemData.cost,
              effect: englishEffect?.effect || "No effect description available.",
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemData.name}.png`,
              category: itemData.category.name
            };
          })
        );
  
        return items;
      } catch (error) {
        console.error('Failed to fetch items:', error);
        return [];
      }
    }
  }