// src/models/Pokemon.model.ts

interface PokemonApiResponse {
  results: PokemonApiResult[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface PokemonApiResult {
  name: string;
  url: string;
}

interface PokemonTypeData {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface PaginatedPokemonResponse {
  pokemon: Pokemon[];
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export class PokemonModel {
  /**
   * Extracts Pokemon ID from its URL
   */
  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1]) : 0;
  }

  /**
   * Maps raw Pokemon API data to our Pokemon interface
   */
  private mapPokemonData(apiData: PokemonApiResult): Pokemon {
    const id = this.extractIdFromUrl(apiData.url);
    return {
      id,
      name: apiData.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      types: [], // Types will be populated separately
    };
  }

  /**
   * Maps Pokemon type data from API response
   */
  private mapPokemonTypes(typeData: PokemonTypeData[]): string[] {
    return typeData.map(type => type.type.name);
  }

  private async getPokemonTypes(id: number): Promise<string[]> {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      return this.mapPokemonTypes(data.types);
    } catch (error) {
      console.error(`Failed to fetch types for Pokemon ${id}:`, error);
      return [];
    }
  }

  async getAllPokemon(limit: number = 30, offset: number = 0): Promise<PaginatedPokemonResponse> {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json() as PokemonApiResponse;
      
      // Map each Pokemon and fetch their types
      const pokemonWithTypes = await Promise.all(
        data.results.map(async (pokemon) => {
          const mappedPokemon = this.mapPokemonData(pokemon);
          mappedPokemon.types = await this.getPokemonTypes(mappedPokemon.id);
          return mappedPokemon;
        })
      );
      
      return {
        pokemon: pokemonWithTypes,
        count: data.count,
        hasNext: data.next !== null,
        hasPrevious: data.previous !== null
      };
    } catch (error) {
      console.error('Failed to fetch Pokemon:', error);
      return {
        pokemon: [],
        count: 0,
        hasNext: false,
        hasPrevious: false
      };
    }
  }
}