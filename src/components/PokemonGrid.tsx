// src/components/PokemonGrid.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
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

export function PokemonGrid({ pokemon, selectedGameId }: PokemonGridProps) {
  const { username } = useAuth();
  const [caughtService] = useState<IDatabaseService>(() => 
    process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE === 'true' 
      ? new LocalStorageService() 
      : new DatabaseService()
  );
  const [caughtPokemon, setCaughtPokemon] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

  // Load caught Pokemon once when game/user changes
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

  const toggleCaught = useCallback(async (pokemonId: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (!selectedGameId || !username) return;

    setIsLoading(prev => ({ ...prev, [pokemonId]: true }));

    try {
      const isCaught = caughtPokemon.includes(pokemonId);
      
      if (isCaught) {
        await caughtService.removeCaughtPokemon(username, selectedGameId, pokemonId);
        setCaughtPokemon(prev => prev.filter(id => id !== pokemonId));
      } else {
        await caughtService.saveCaughtPokemon({
          userId: username,
          gameId: selectedGameId,
          pokemonId
        });
        setCaughtPokemon(prev => [...prev, pokemonId]);
      }
    } catch (error) {
      console.error('Error toggling Pokemon:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [pokemonId]: false }));
    }
  }, [selectedGameId, username, caughtService, caughtPokemon]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {pokemon.map((p) => {
        const isCaught = caughtPokemon.includes(p.id);
        const isProcessing = isLoading[p.id];
        
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

            {selectedGameId && username && (
              <button
                onClick={(e) => toggleCaught(p.id, e)}
                disabled={isProcessing}
                className={`mt-3 px-3 py-1.5 rounded-full text-sm font-medium
                  flex items-center justify-center gap-2 w-full transition-colors
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isCaught
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <CheckCheck className="w-4 h-4" />
                {isProcessing ? 'Processing...' : isCaught ? 'Caught!' : 'Catch'}
              </button>
            )}
            
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