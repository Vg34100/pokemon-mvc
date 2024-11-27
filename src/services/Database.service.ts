// src/services/Database.service.ts
import { CaughtPokemon, IDatabaseService } from "./Database.interface";
import api from "@/api/api";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}

export class DatabaseService implements IDatabaseService {
    async saveCaughtPokemon(data: Omit<CaughtPokemon, 'caughtDate'>): Promise<void> {
        try {
            await api.post('/caught-pokemon/', {
                pokemonId: data.pokemonId,
                gameId: data.gameId
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const apiError = error.response.data as ApiError;
                throw new Error(apiError.error);
            }
            throw new Error('Failed to save caught Pokemon');
        }
    }

    async removeCaughtPokemon(userId: string, gameId: number, pokemonId: number): Promise<void> {
        try {
            await api.delete(`/caught-pokemon/${pokemonId}/${gameId}/`);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const apiError = error.response.data as ApiError;
                throw new Error(apiError.error);
            }
            throw new Error('Failed to remove caught Pokemon');
        }
    }

    async getCaughtPokemon(userId: string, gameId: number): Promise<number[]> {
        try {
            const response = await api.get<{ pokemon: number[] }>(`/caught-pokemon/game/${gameId}/`);
            return response.data.pokemon;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const apiError = error.response.data as ApiError;
                throw new Error(apiError.error);
            }
            throw new Error('Failed to get caught Pokemon');
        }
    }

    async isPokemonCaught(userId: string, gameId: number, pokemonId: number): Promise<boolean> {
        try {
            const response = await api.get<{ caught: boolean }>(`/caught-pokemon/check/${pokemonId}/${gameId}/`);
            return response.data.caught;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const apiError = error.response.data as ApiError;
                throw new Error(apiError.error);
            }
            throw new Error('Failed to check Pokemon status');
        }
    }
}