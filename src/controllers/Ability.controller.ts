// src/controllers/Ability.controller.ts
import { AbilityModel, Ability } from '@/models/Ability.model';

export class AbilityController {
  private model: AbilityModel;

  constructor() {
    this.model = new AbilityModel();
  }

  async getAbilitiesList(): Promise<{
    data: Ability[] | null;
    error: string | null;
  }> {
    try {
      const abilities = await this.model.getAllAbilities();
      return { data: abilities, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load abilities' };
    }
  }
}