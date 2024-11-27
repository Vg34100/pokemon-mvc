// src/models/Game.model.ts
/**
 * Interfaces for PokeAPI version group data
 */
export interface VersionGroup {
    id: number;
    name: string;
    generation: {
      name: string;
    };
    pokedexes: {
      url: string;
    }[];
  }
  
  /**
   * Represents a game version with its available Pokemon
   */
  export interface Game {
    id: number;
    name: string;
    versionGroup: string;
    availablePokemon: number[];
  }
  
  export class GameModel {
    private baseUrl = 'https://pokeapi.co/api/v2';
  
    /**
     * Fetches all version groups and their available Pokemon from PokeAPI
     * @returns Promise<Game[]> Array of games with their available Pokemon
     */
    async getVersionGroups(): Promise<Game[]> {
      try {
        const response = await fetch(`${this.baseUrl}/version-group`);
        const data = await response.json();
        
        return Promise.all(data.results.map(async (group: { url: string }) => {
          const groupResponse = await fetch(group.url);
          const groupData: VersionGroup = await groupResponse.json();
          
          // Get the first pokedex for this version group
          const pokedexUrl = groupData.pokedexes[0]?.url;
          let availablePokemon: number[] = [];
          
          if (pokedexUrl) {
            const pokedexResponse = await fetch(pokedexUrl);
            const pokedexData = await pokedexResponse.json();
            availablePokemon = pokedexData.pokemon_entries.map(
              (entry: { entry_number: number }) => entry.entry_number
            );
          }
          
          return {
            id: groupData.id,
            name: groupData.name.replace('-', ' ').toUpperCase(),
            versionGroup: groupData.generation.name,
            availablePokemon
          };
        }));
      } catch (error) {
        console.error('Failed to fetch version groups:', error);
        return [];
      }
    }
  }