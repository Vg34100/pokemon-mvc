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
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load Pokemon' };
    }
  }
}
