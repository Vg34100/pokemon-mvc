// src/controllers/Game.controller.ts
import { GameModel, Game, VersionGroupResponse, VersionPokemonResponse } from '@/models/VersionGroup.model';

export class GameController {
  private model: GameModel;

  constructor() {
    this.model = new GameModel();
  }

  async getVersionGroups(): Promise<VersionGroupResponse> {
    try {
      const games = await this.model.getVersionGroups();
      return { data: games, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load game versions' };
    }
  }

  async getVersionGroupPokemon(groupId: number): Promise<VersionPokemonResponse> {
    try {
      const games = await this.model.getVersionGroups();
      const game = games.find((g: Game) => g.id === groupId);
      
      if (!game) {
        throw new Error(`Version group ${groupId} not found`);
      }

      // Create mapping of national dex numbers to regional dex numbers
      const dexNumbers = game.availablePokemon.reduce<{ [key: number]: number }>((acc, pokemon) => {
        acc[pokemon.id] = pokemon.entryNumber;
        return acc;
      }, {});

      return { 
        data: game.availablePokemon.map(p => p.id), 
        error: null,
        dexNumbers
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load Pokémon';
      console.error('Controller error:', error);
      return { 
        data: null, 
        error: `Failed to load Pokémon for version group ${groupId}`
      };
    }
  }

  getGamesByGeneration(games: Game[]): { [key: string]: Game[] } {
    return games.reduce<{ [key: string]: Game[] }>((acc, game) => {
      const gen = game.versionGroup;
      if (!acc[gen]) {
        acc[gen] = [];
      }
      acc[gen].push(game);
      return acc;
    }, {});
  }
}