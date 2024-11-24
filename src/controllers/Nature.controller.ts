// src/controllers/Nature.controller.ts
import { NatureModel, Nature } from '@/models/Nature.model';

export class NatureController {
  private model: NatureModel;

  constructor() {
    this.model = new NatureModel();
  }

  async getNaturesList(): Promise<{
    data: Nature[] | null;
    error: string | null;
  }> {
    try {
      const natures = await this.model.getAllNatures();
      return { data: natures, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load natures' };
    }
  }
}