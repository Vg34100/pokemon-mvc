// src/components/PokemonGrid.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Pokemon } from '@/models/Pokemon.model';
import { useAuth } from '@/contexts/AuthContext';
import { LocalStorageService } from '@/services/LocalStorage.service';
import type { IDatabaseService } from '@/services/Database.interface';
import { Check, CheckCheck } from 'lucide-react';
import { DatabaseService } from '@/services/Database.service';

interface PokemonGridProps {
  pokemon: Pokemon[];
  selectedGameId: number | null;
}

/**
 * Grid display of Pokemon with caught status tracking
 * Integrates with auth system and storage service for persistence
 */
export function PokemonGrid({ pokemon, selectedGameId }: PokemonGridProps) {
  const { username } = useAuth();
  // const [caughtService] = useState<IDatabaseService>(() => new LocalStorageService());
  const [caughtService] = useState<IDatabaseService>(() => 
    process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE === 'true' 
      ? new LocalStorageService() 
      : new DatabaseService()
  );
  const [caughtPokemon, setCaughtPokemon] = useState<number[]>([]);

  // Load caught Pokemon on mount and when game/user changes
  useEffect(() => {
    const loadCaughtPokemon = async () => {
      if (selectedGameId && username) {
        const caught = await caughtService.getCaughtPokemon(username, selectedGameId);
        setCaughtPokemon(caught);
      } else {
        setCaughtPokemon([]);
      }
    };

    loadCaughtPokemon();
  }, [selectedGameId, username, caughtService]);

  /**
   * Handles toggling the caught status of a Pokemon
   */
  const toggleCaught = async (pokemonId: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (!selectedGameId || !username) return;

    const isCaught = await caughtService.isPokemonCaught(
      username, 
      selectedGameId, 
      pokemonId
    );
    
    if (isCaught) {
      await caughtService.removeCaughtPokemon(username, selectedGameId, pokemonId);
    } else {
      await caughtService.saveCaughtPokemon({
        userId: username,
        gameId: selectedGameId,
        pokemonId
      });
    }
    
    // Refresh caught Pokemon list
    const caught = await caughtService.getCaughtPokemon(username, selectedGameId);
    setCaughtPokemon(caught);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {pokemon.map((p) => {
        const isCaught = caughtPokemon.includes(p.id);
        
        return (
          <div
            key={p.id}
            className={`relative bg-white rounded-lg p-4 text-center transition-all
              ${isCaught 
                ? 'ring-2 ring-green-500 shadow-lg' 
                : 'hover:shadow-lg'
              }`}
          >
            <Link href={`/pokemon/${p.id}`} className="block">
              <p className="absolute top-2 left-2 text-sm text-gray-500">
                #{p.id.toString().padStart(4, "0")}
              </p>
              
              {/* Caught indicator */}
              {isCaught && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
              
              <div className="relative w-full h-24 mx-auto">
                <Image
                  src={p.sprite}
                  alt={p.name}
                  fill
                  sizes="(max-width: 96px) 100vw, 96px"
                  priority={p.id <= 12}
                  className={`object-contain transition-opacity duration-200
                    ${isCaught ? 'opacity-100' : 'opacity-75'}`}
                />
              </div>
              <h2 className="mt-2 capitalize font-medium text-black">{p.name}</h2>
            </Link>

            {/* Catch button - only shown when logged in */}
            {selectedGameId && username && (
              <button
                onClick={(e) => toggleCaught(p.id, e)}
                className={`mt-3 px-3 py-1.5 rounded-full text-sm font-medium
                  flex items-center justify-center gap-2 w-full transition-colors
                  ${isCaught
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <CheckCheck className="w-4 h-4" />
                {isCaught ? 'Caught!' : 'Catch'}
              </button>
            )}
            
            {/* Login prompt */}
            {selectedGameId && !username && (
              <div className="mt-3 text-xs text-gray-500">
                Login to track catches
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}