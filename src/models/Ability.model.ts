// src/models/Ability.model.ts
interface AbilityApiResponse {
    id: number;
    name: string;
    effect_entries: {
      effect: string;
      short_effect: string;
      language: {
        name: string;
      };
    }[];
  }
  
  export interface Ability {
    id: number;
    name: string;
    effect: string;
    shortEffect: string;
  }
  
  export class AbilityModel {
    async getAllAbilities(limit: number = 300): Promise<Ability[]> {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/ability?limit=${limit}`
        );
        const data = await response.json();
        
        const abilities = await Promise.all(
          data.results.map(async (ability: { name: string; url: string }) => {
            const abilityResponse = await fetch(ability.url);
            const abilityData: AbilityApiResponse = await abilityResponse.json();
  
            const englishEntry = abilityData.effect_entries.find(
              entry => entry.language.name === "en"
            );
  
            return {
              id: abilityData.id,
              name: abilityData.name,
              effect: englishEntry?.effect || "No description available.",
              shortEffect: englishEntry?.short_effect || "No description available."
            };
          })
        );
  
        return abilities;
      } catch (error) {
        console.error('Failed to fetch abilities:', error);
        return [];
      }
    }
  }