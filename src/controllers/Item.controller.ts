// src/controllers/Item.controller.ts
import { ItemModel, Item } from '@/models/Item.model';

export class ItemController {
  private model: ItemModel;

  constructor() {
    this.model = new ItemModel();
  }

  async getItemsList(): Promise<{
    data: Item[] | null;
    error: string | null;
  }> {
    try {
      const items = await this.model.getAllItems();
      return { data: items, error: null };
    } catch (err) {
      console.error('Controller error:', err);
      return { data: null, error: 'Failed to load items' };
    }
  }
}