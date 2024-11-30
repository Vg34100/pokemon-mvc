export interface Party {
    id: string;
    userId: string;
    name: string;
    gameId: number;
    pokemon: (number | null)[];
    createdAt: string;
    updatedAt: string;
  }
  
  export class PartyModel {
    private static validateParty(party: Partial<Party>): boolean {
      if (!party.name || party.name.trim() === '') return false;
      if (!party.gameId) return false;
      if (!Array.isArray(party.pokemon)) return false;
      if (party.pokemon.length > 6) return false;
      return true;
    }
  
    async createParty(data: Omit<Party, 'id' | 'createdAt' | 'updatedAt'>): Promise<Party> {
      if (!PartyModel.validateParty(data)) {
        throw new Error('Invalid party data');
      }
  
      const now = new Date().toISOString();
      const party: Party = {
        id: crypto.randomUUID(),
        ...data,
        pokemon: Array(6).fill(null), // Initialize with 6 empty slots
        createdAt: now,
        updatedAt: now
      };
  
      return party;
    }
  }