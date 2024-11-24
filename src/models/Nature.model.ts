// src/models/Nature.model.ts
interface NatureApiResponse {
    id: number;
    name: string;
    increased_stat: {
      name: string;
    } | null;
    decreased_stat: {
      name: string;
    } | null;
    likes_flavor: {
      name: string;
    } | null;
    hates_flavor: {
      name: string;
    } | null;
  }
  
  export interface Nature {
    id: number;
    name: string;
    increasedStat: string | null;
    decreasedStat: string | null;
    likesFlavor: string | null;
    hatesFlavor: string | null;
  }
  
  export class NatureModel {
    private formatStatName(stat: string): string {
      const statNames: { [key: string]: string } = {
        'attack': 'Attack',
        'defense': 'Defense',
        'special-attack': 'Sp. Atk',
        'special-defense': 'Sp. Def',
        'speed': 'Speed'
      };
      return statNames[stat] || stat;
    }
  
    async getAllNatures(): Promise<Nature[]> {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/nature?limit=25');
        const data = await response.json();
        
        const natures = await Promise.all(
          data.results.map(async (nature: { name: string; url: string }) => {
            const natureResponse = await fetch(nature.url);
            const natureData: NatureApiResponse = await natureResponse.json();
  
            return {
              id: natureData.id,
              name: natureData.name,
              increasedStat: natureData.increased_stat ? 
                this.formatStatName(natureData.increased_stat.name) : null,
              decreasedStat: natureData.decreased_stat ? 
                this.formatStatName(natureData.decreased_stat.name) : null,
              likesFlavor: natureData.likes_flavor?.name || null,
              hatesFlavor: natureData.hates_flavor?.name || null
            };
          })
        );
  
        return natures;
      } catch (error) {
        console.error('Failed to fetch natures:', error);
        return [];
      }
    }
  }