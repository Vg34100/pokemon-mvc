// src/services/Database.interface.ts
/**
 * Base interface for Pokemon tracking operations
 */
export interface CaughtPokemon {
  userId: string;
  gameId: number;  // This is version_group_id in the backend
  pokemonId: number;
  caughtDate: string;
}

export interface IDatabaseService {
  saveCaughtPokemon(data: Omit<CaughtPokemon, 'caughtDate'>): Promise<void>;
  removeCaughtPokemon(userId: string, gameId: number, pokemonId: number): Promise<void>;
  getCaughtPokemon(userId: string, gameId: number): Promise<number[]>;
  isPokemonCaught(userId: string, gameId: number, pokemonId: number): Promise<boolean>;
}