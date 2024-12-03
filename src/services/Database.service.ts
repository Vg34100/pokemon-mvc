/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/Database.service.ts
import { IDatabaseService, CaughtPokemon, Party } from './Database.interface';import api from "@/api/api";
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

    // src/services/Database.service.ts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async isPokemonCaught(_userId: string, _gameId: number, _pokemonId: number): Promise<boolean> {
        // This is kept only for interface compliance but is no longer used
        return false;
    }


    // Party stuff
        async getParties(userId: string): Promise<Party[]> {
        // TODO: Implement when API is ready
        throw new Error('Not implemented');
        // try {
        //     const response = await api.get<{ parties: Party[] }>(`/parties/`);
        //     return response.data.parties;
        // } catch (error) {
        //     throw new Error('Failed to get parties');
        // }
    }

    async saveParty(party: Omit<Party, 'id' | 'createdAt' | 'updatedAt'>): Promise<Party> {
        // TODO: Implement when API is ready
        throw new Error('Not implemented');
        // try {
        //     const response = await api.post<Party>('/parties/', party);
        //     return response.data;
        // } catch (error) {
        //     throw new Error('Failed to save party');
        // }
    }

    async updateParty(party: Party): Promise<void> {
        // TODO: Implement when API is ready
        throw new Error('Not implemented');
        // try {
        //     await api.put(`/parties/${party.id}/`, party);
        // } catch (error) {
        //     throw new Error('Failed to update party');
        // }
    }

    async deleteParty(userId: string, partyId: string): Promise<void> {
        // TODO: Implement when API is ready
        throw new Error('Not implemented');
        // try {
        //     await api.delete(`/parties/${partyId}/`);
        // } catch (error) {
        //     throw new Error('Failed to delete party');
        // }
    }
}