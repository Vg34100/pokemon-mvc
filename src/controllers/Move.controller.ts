// src/controllers/Move.controller.ts
import { MoveModel, Move } from '@/models/Move.model';

export class MoveController {
  private model: MoveModel;

  constructor() {
    this.model = new MoveModel();
  }

  async getMovesList(): Promise<{
    data: Move[] | null;
    error: string | null;
  }> {
    try {
      const moves = await this.model.getAllMoves();
      return { data: moves, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load moves' };
    }
  }
}