// src/models/Pokemon.model.ts
interface PokemonApiResponse {
    results: {
      name: string;
      url: string;
    }[];
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
    types: string[];  // New field
  }
  
  export class PokemonModel {
    private async getPokemonTypes(id: number): Promise<string[]> {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        return data.types.map((type: PokemonTypeData) => type.type.name);
      } catch (error) {
        console.error(`Failed to fetch types for Pokemon ${id}:`, error);
        return [];
      }
    }
  
    async getAllPokemon(limit: number = 151): Promise<Pokemon[]> {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
        );
        const data = await response.json() as PokemonApiResponse;
        
        // Fetch types for each Pokemon
        const pokemonWithTypes = await Promise.all(
          data.results.map(async (pokemon, index) => {
            const id = index + 1;
            const types = await this.getPokemonTypes(id);
            return {
              id,
              name: pokemon.name,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
              types
            };
          })
        );
        
        return pokemonWithTypes;
      } catch (error) {
        console.error('Failed to fetch Pokemon:', error);
        return [];
      }
    }
  }