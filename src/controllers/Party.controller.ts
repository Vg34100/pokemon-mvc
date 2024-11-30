// src/controllers/Party.controller.ts
import { Party, IDatabaseService } from '@/services/Database.interface';
import { LocalStorageService } from '@/services/LocalStorage.service';
import { DatabaseService } from '@/services/Database.service';

export class PartyController {
  private service: IDatabaseService;

  constructor() {
    this.service = process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE === 'true'
      ? new LocalStorageService()
      : new DatabaseService();
  }

  async getUserParties(userId: string): Promise<{
    data: Party[] | null;
    error: string | null;
  }> {
    try {
      const parties = await this.service.getParties(userId);
      return { data: parties, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load parties' };
    }
  }

  async createParty(userId: string, name: string, gameId: number): Promise<{
    data: Party | null;
    error: string | null;
  }> {
    try {
      const party = await this.service.saveParty({
        userId,
        name,
        gameId,
        pokemon: Array(6).fill(null)
      });
      return { data: party, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to create party' };
    }
  }

  async updatePartyPokemon(party: Party, slot: number, pokemonId: number | null): Promise<{
    data: Party | null;
    error: string | null;
  }> {
    try {
      if (slot < 0 || slot > 5) {
        throw new Error('Invalid slot number');
      }

      const updatedPokemon = [...party.pokemon];
      updatedPokemon[slot] = pokemonId;

      const updatedParty = {
        ...party,
        pokemon: updatedPokemon
      };

      await this.service.updateParty(updatedParty);
      return { data: updatedParty, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to update party' };
    }
  }

  async deleteParty(userId: string, partyId: string): Promise<{
    error: string | null;
  }> {
    try {
      await this.service.deleteParty(userId, partyId);
      return { error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { error: 'Failed to delete party' };
    }
  }
}