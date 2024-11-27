// src/controllers/Game.controller.ts
import { GameModel, Game } from '@/models/Game.model';

export class GameController {
  private model: GameModel;

  constructor() {
    this.model = new GameModel();
  }

  /**
   * Gets all version groups sorted by generation
   */
  async getVersionGroups(): Promise<{
    data: Game[] | null;
    error: string | null;
  }> {
    try {
      const games = await this.model.getVersionGroups();
      
      // Sort games by generation and group
      const sortedGames = games.sort((a, b) => {
        const genA = parseInt(a.versionGroup.split('-')[1]);
        const genB = parseInt(b.versionGroup.split('-')[1]);
        
        if (genA === genB) {
          return a.id - b.id;
        }
        return genA - genB;
      });

      return { data: sortedGames, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load game versions' };
    }
  }

  /**
   * Gets Pokemon available in a specific version group
   */
  async getVersionGroupPokemon(groupId: number): Promise<{
    data: number[] | null;
    error: string | null;
  }> {
    try {
      const { data: games } = await this.getVersionGroups();
      if (!games) {
        throw new Error('No games data available');
      }

      const game = games.find(g => g.id === groupId);
      if (!game) {
        throw new Error(`Version group ${groupId} not found`);
      }

      return { data: game.availablePokemon, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { 
        data: null, 
        error: `Failed to load Pokémon for version group ${groupId}`
      };
    }
  }

  /**
   * Groups games by their generation
   */
  getGamesByGeneration(games: Game[]): { [key: string]: Game[] } {
    return games.reduce((acc, game) => {
      const gen = game.versionGroup;
      if (!acc[gen]) {
        acc[gen] = [];
      }
      acc[gen].push(game);
      return acc;
    }, {} as { [key: string]: Game[] });
  }
}