// src/controllers/Pokemon.controller.ts
import { PokemonModel, PaginatedPokemonResponse } from '@/models/Pokemon.model';

export interface PokemonListResponse {
  data: PaginatedPokemonResponse | null;
  error: string | null;
}

export class PokemonController {
  private model: PokemonModel;

  constructor() {
    this.model = new PokemonModel();
  }

  async getPokemonList(limit: number = 30, offset: number = 0): Promise<PokemonListResponse> {
    try {
      const paginatedData = await this.model.getAllPokemon(limit, offset);
      return { data: paginatedData, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load Pokemon' };
    }
  }
}