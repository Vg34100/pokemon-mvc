// src/controllers/Pokemon.controller.ts
import { PokemonModel, Pokemon } from '@/models/Pokemon.model';

export class PokemonController {
  private model: PokemonModel;

  constructor() {
    this.model = new PokemonModel();
  }

  async getPokemonList(): Promise<{
    data: Pokemon[] | null;
    error: string | null;
  }> {
    try {
      const pokemon = await this.model.getAllPokemon();
      return { data: pokemon, error: null };
    } catch (err) { // Changed from 'error' to 'err' to avoid shadow naming
      console.error('Controller error:', err); // Log the error
      return { data: null, error: 'Failed to load Pokemon' };
    }
  }
}