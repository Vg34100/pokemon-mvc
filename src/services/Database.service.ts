// src/services/Database.service.ts
import { CaughtPokemon, IDatabaseService } from "./Database.interface";

export class DatabaseService implements IDatabaseService {
    private baseUrl = 'http://silverpi.ddns.net:54321';

    async saveCaughtPokemon(data: Omit<CaughtPokemon, 'caughtDate'>): Promise<void> {
        const response = await fetch(`${this.baseUrl}/caught-pokemon/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                pokemonId: data.pokemonId,
                gameId: data.gameId
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save caught Pokemon');
        }
    }

    async removeCaughtPokemon(userId: string, gameId: number, pokemonId: number): Promise<void> {
        const response = await fetch(
            `${this.baseUrl}/caught-pokemon/${pokemonId}/${gameId}/`,
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove caught Pokemon');
        }
    }

    async getCaughtPokemon(userId: string, gameId: number): Promise<number[]> {
        const response = await fetch(
            `${this.baseUrl}/caught-pokemon/game/${gameId}/`,
            {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get caught Pokemon');
        }

        const data = await response.json();
        return data.pokemon;
    }

    async isPokemonCaught(userId: string, gameId: number, pokemonId: number): Promise<boolean> {
        const response = await fetch(
            `${this.baseUrl}/caught-pokemon/check/${pokemonId}/${gameId}/`,
            {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to check Pokemon status');
        }

        const data = await response.json();
        return data.caught;
    }
}