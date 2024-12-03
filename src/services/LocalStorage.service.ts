// src/services/LocalStorage.service.ts
import { IDatabaseService, CaughtPokemon, Party } from './Database.interface';
/**
 * Temporary local storage implementation of the database service
 */
export class LocalStorageService implements IDatabaseService {
  private storageKey = 'caught-pokemon';
  private caughtStorageKey = 'caught-pokemon';
  private partyStorageKey = 'pokemon-parties';
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


  // Party stuff
  private getPartyData(): Party[] {
    const stored = localStorage.getItem(this.partyStorageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private savePartyData(parties: Party[]): void {
    localStorage.setItem(this.partyStorageKey, JSON.stringify(parties));
  }

  async getParties(userId: string): Promise<Party[]> {
    const parties = this.getPartyData();
    return parties.filter(party => party.userId === userId);
  }

  async saveParty(data: Omit<Party, 'id' | 'createdAt' | 'updatedAt'>): Promise<Party> {
    const parties = this.getPartyData();
    const now = new Date().toISOString();
    
    const newParty: Party = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now
    };

    parties.push(newParty);
    this.savePartyData(parties);
    return newParty;
  }

  async updateParty(party: Party): Promise<void> {
    const parties = this.getPartyData();
    const index = parties.findIndex(p => p.id === party.id && p.userId === party.userId);
    if (index === -1) throw new Error('Party not found');
    
    parties[index] = {
      ...party,
      updatedAt: new Date().toISOString()
    };
    
    this.savePartyData(parties);
  }

  async deleteParty(userId: string, partyId: string): Promise<void> {
    const parties = this.getPartyData();
    const filtered = parties.filter(p => !(p.id === partyId && p.userId === userId));
    this.savePartyData(filtered);
  }
}