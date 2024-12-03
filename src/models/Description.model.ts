// src/models/Description.model.ts
interface PokemonSpeciesApiResponse {
    id: number;
    name: string;
    flavor_text_entries: {
      flavor_text: string;
      language: {
        name: string;
      };
      version: {
        name: string;
      };
    }[];
  }
  
  export interface Description {
    id: number;
    name: string;
    description: string;
  }
  
  export class DescriptionModel {
    async getDescription(id: number): Promise<Description | null> {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const data: PokemonSpeciesApiResponse = await response.json();
  
        const englishEntry = data.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
  
        return {
          id: data.id,
          name: data.name,
          description: englishEntry ? englishEntry.flavor_text.replace(/\n|\f/g, ' ') : "Description not available."
        };
      } catch (error) {
        console.error(`Failed to fetch description for Pokémon with ID ${id}:`, error);
        return null;
      }
    }
  }