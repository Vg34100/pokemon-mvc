// src/services/Database.interface.ts
/**
 * Base interface for Pokemon tracking operations
 */
export interface Party {
  id: string;
  userId: string;
  name: string;
  gameId: number;
  pokemon: (number | null)[];
  createdAt: string;
  updatedAt: string;
}

export interface CaughtPokemon {
  userId: string;
  gameId: number;
  pokemonId: number;
  caughtDate: string;
}

export interface IDatabaseService {
  // Existing methods
  saveCaughtPokemon(data: Omit<CaughtPokemon, 'caughtDate'>): Promise<void>;
  removeCaughtPokemon(userId: string, gameId: number, pokemonId: number): Promise<void>;
  getCaughtPokemon(userId: string, gameId: number): Promise<number[]>;
  isPokemonCaught(userId: string, gameId: number, pokemonId: number): Promise<boolean>;

  // New party methods
  getParties(userId: string): Promise<Party[]>;
  saveParty(party: Omit<Party, 'id' | 'createdAt' | 'updatedAt'>): Promise<Party>;
  updateParty(party: Party): Promise<void>;
  deleteParty(userId: string, partyId: string): Promise<void>;
}