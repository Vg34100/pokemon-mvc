// src/models/Game.model.ts
interface PokemonEntry {
  entry_number: number;
  pokemon_species: {
    name: string;
    url: string;
  };
}

interface PokedexApiResponse {
  pokemon_entries: PokemonEntry[];
}

interface VersionGroup {
  id: number;
  name: string;
  generation: {
    name: string;
  };
  pokedexes: {
    url: string;
  }[];
}

export interface Game {
  id: number;
  name: string;
  versionGroup: string;
  availablePokemon: {
    id: number;          // National dex number
    entryNumber: number; // Regional dex number
  }[];
}

export interface VersionGroupResponse {
  data: Game[] | null;
  error: string | null;
}

export interface VersionPokemonResponse {
  data: number[] | null;
  error: string | null;
  dexNumbers?: { [key: number]: number }; // Maps national dex ID to regional dex number
}

export class GameModel {
  private baseUrl = 'https://pokeapi.co/api/v2';

  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/?$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  async getVersionGroups(): Promise<Game[]> {
    try {
      const response = await fetch(`${this.baseUrl}/version-group`);
      const data: { results: Array<{ url: string }> } = await response.json();
      
      return Promise.all(data.results.map(async (group: { url: string }) => {
        const groupResponse = await fetch(group.url);
        const groupData: VersionGroup = await groupResponse.json();
        
        const pokedexUrl = groupData.pokedexes[0]?.url;
        let availablePokemon: Game['availablePokemon'] = [];
        
        if (pokedexUrl) {
          const pokedexResponse = await fetch(pokedexUrl);
          const pokedexData: PokedexApiResponse = await pokedexResponse.json();
          
          availablePokemon = pokedexData.pokemon_entries.map(entry => ({
            id: this.extractIdFromUrl(entry.pokemon_species.url),
            entryNumber: entry.entry_number
          }));
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