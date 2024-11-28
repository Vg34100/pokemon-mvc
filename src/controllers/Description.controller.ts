// src/controllers/Description.controller.ts
import { DescriptionModel, Description } from '@/models/Description.model';

export class DescriptionController {
  private model: DescriptionModel;

  constructor() {
    this.model = new DescriptionModel();
  }

  async getDescription(id: number): Promise<{
    data: Description | null;
    error: string | null;
  }> {
    try {
      const description = await this.model.getDescription(id);
      if (!description) {
        return { data: null, error: "No description found." };
      }
      return { data: description, error: null };
    } catch (error) {
      console.error(`Error fetching description for Pokémon ID ${id}:`, error);
      return { data: null, error: "Failed to fetch description." };
    }
  }
}