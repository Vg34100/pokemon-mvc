// src/models/Move.model.ts
interface MoveApiResponse {
    id: number;
    name: string;
    accuracy: number | null;
    power: number | null;
    pp: number;
    type: {
      name: string;
    };
    damage_class: {
      name: string;
    };
    effect_entries: {
      effect: string;
      short_effect: string;
      language: {
        name: string;
      };
    }[];
  }
  
  export interface Move {
    id: number;
    name: string;
    accuracy: number | null;
    power: number | null;
    pp: number;
    type: string;
    damageClass: string;
    effect: string;
    shortEffect: string;
  }
  
  export class MoveModel {
    async getAllMoves(limit: number = 850): Promise<Move[]> {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/move?limit=${limit}`
        );
        const data = await response.json();
        
        // Fetch detailed data for each move
        const moves = await Promise.all(
          data.results.map(async (move: { name: string; url: string }) => {
            const moveResponse = await fetch(move.url);
            const moveData: MoveApiResponse = await moveResponse.json();
  
            const englishEffect = moveData.effect_entries.find(
              entry => entry.language.name === "en"
            );
  
            return {
              id: moveData.id,
              name: moveData.name,
              accuracy: moveData.accuracy,
              power: moveData.power,
              pp: moveData.pp,
              type: moveData.type.name,
              damageClass: moveData.damage_class.name,
              effect: englishEffect?.effect || "No effect description available.",
              shortEffect: englishEffect?.short_effect || "No effect description available."
            };
          })
        );
  
        return moves;
      } catch (error) {
        console.error('Failed to fetch moves:', error);
        return [];
      }
    }
  }
  