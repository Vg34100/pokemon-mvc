// src/controllers/Pokemon.controller.ts
import { PokemonModel, Pokemon } from '@/models/Pokemon.model';

export class PokemonController {
  private model: PokemonModel;

  constructor() {
    this.model = new PokemonModel();
  }

  async getPokemonList(limit: number = 30, offset: number = 0): Promise<{
    data: Pokemon[] | null;
    error: string | null;
  }> {
    try {
      const pokemon = await this.model.getAllPokemon(limit, offset);
      return { data: pokemon, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load Pokemon' };
    }
  }
}