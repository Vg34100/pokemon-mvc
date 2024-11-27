// src/services/LocalStorage.service.ts
import { IDatabaseService, CaughtPokemon } from './Database.interface';

/**
 * Temporary local storage implementation of the database service
 */
export class LocalStorageService implements IDatabaseService {
  private storageKey = 'caught-pokemon';

  /**
   * Gets all caught Pokemon data from local storage
   */
  private getCaughtPokemonData(): CaughtPokemon[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Saves caught Pokemon data to local storage
   */
  private saveCaughtPokemonData(caught: CaughtPokemon[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(caught));
  }

  async saveCaughtPokemon(data: Omit<CaughtPokemon, 'caughtDate'>): Promise<void> {
    const caught = this.getCaughtPokemonData();
    caught.push({
      ...data,
      caughtDate: new Date().toISOString()
    });
    this.saveCaughtPokemonData(caught);
  }

  async removeCaughtPokemon(userId: string, gameId: number, pokemonId: number): Promise<void> {
    const caught = this.getCaughtPokemonData();
    const filtered = caught.filter(
      p => !(p.userId === userId && p.gameId === gameId && p.pokemonId === pokemonId)
    );
    this.saveCaughtPokemonData(filtered);
  }

  async getCaughtPokemon(userId: string, gameId: number): Promise<number[]> {
    const caught = this.getCaughtPokemonData();
    return caught
      .filter(p => p.userId === userId && p.gameId === gameId)
      .map(p => p.pokemonId);
  }

  async isPokemonCaught(userId: string, gameId: number, pokemonId: number): Promise<boolean> {
    const caught = this.getCaughtPokemonData();
    return caught.some(
      p => p.userId === userId && p.gameId === gameId && p.pokemonId === pokemonId
    );
  }
}