// src/models/Pokemon.model.ts
interface PokemonApiResponse {
    results: {
      name: string;
      url: string;
    }[];
  }
  
  export interface Pokemon {
    id: number;
    name: string;
    sprite: string;
  }
  
  export class PokemonModel {
    async getAllPokemon(limit: number = 1000): Promise<Pokemon[]> {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
        );
        const data = await response.json() as PokemonApiResponse;
        
        return data.results.map((pokemon, index) => ({
          id: index + 1,
          name: pokemon.name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
        }));
      } catch (error) {
        console.error('Failed to fetch Pokemon:', error);
        return [];
      }
    }
  }
  