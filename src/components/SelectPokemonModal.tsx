'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pokemon } from '@/models/Pokemon.model';
import { PokemonController } from '@/controllers/Pokemon.controller';
import { SearchBar } from './SearchBar';
import Image from 'next/image';
import { X } from 'lucide-react';
import { GameController } from '@/controllers/Game.controller';

interface SelectPokemonModalProps {
  gameId: number;
  onSelect: (pokemonId: number) => void;
  onClose: () => void;
}

export function SelectPokemonModal({
  gameId,
  onSelect,
  onClose
}: SelectPokemonModalProps) {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [versionPokemonIds, setVersionPokemonIds] = useState<Set<number>>(new Set());

  // Load version-specific Pokemon IDs
  useEffect(() => {
    const loadVersionPokemon = async () => {
      try {
        const gameController = new GameController();
        const { data: versionPokemon } = await gameController.getVersionGroupPokemon(gameId);
        if (versionPokemon) {
          setVersionPokemonIds(new Set(versionPokemon));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load version data');
      }
    };

    loadVersionPokemon();
    setAllPokemon([]);
    setOffset(0);
    setHasMore(true);
  }, [gameId]);

  // Load more Pokemon
  const loadMorePokemon = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const controller = new PokemonController();
      const { data: newPokemon } = await controller.getPokemonList(30, offset);

      if (newPokemon && newPokemon.length > 0) {
        setAllPokemon((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniquePokemon = newPokemon.filter((p) => !existingIds.has(p.id));
          return [...prev, ...uniquePokemon].sort((a, b) => a.id - b.id);
        });
        setOffset((prev) => prev + newPokemon.length);
        return newPokemon.length; // Return the number of new Pokemon loaded
      } else {
        setHasMore(false);
        return 0;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Pokemon');
      return 0;
    } finally {
      setLoading(false);
    }
  };

  // Continuous search loading
  const searchWithContinuousLoad = async () => {
    if (!searchTerm || !hasMore) return;
    
    setSearching(true);
    let foundMatch = false;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops

    while (!foundMatch && hasMore && attempts < maxAttempts) {
      const newPokemonCount = await loadMorePokemon();
      if (newPokemonCount === 0) break;

      // Check if we found a match in the new Pokemon
      const currentFiltered = allPokemon.filter(p => 
        versionPokemonIds.has(p.id) && (
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toString().includes(searchTerm)
        )
      );

      foundMatch = currentFiltered.length > 0;
      attempts++;
    }

    setSearching(false);
  };

  // Initial load
  useEffect(() => {
    if (allPokemon.length === 0) {
      loadMorePokemon();
    }
  }, [allPokemon.length]);

  // Apply filters
  useEffect(() => {
    const filtered = allPokemon
      .filter(p => versionPokemonIds.has(p.id))
      .filter(p => 
        !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
      )
      .sort((a, b) => a.id - b.id);

    setFilteredPokemon(filtered);

    // If searching and no results, trigger continuous load
    if (searchTerm && filtered.length === 0 && hasMore && !searching) {
      searchWithContinuousLoad();
    }
  }, [allPokemon, searchTerm, versionPokemonIds]);

  // Load more filtered results
  useEffect(() => {
    if (!loading && filteredPokemon.length > displayedPokemon.length) {
      setDisplayedPokemon(prev => {
        const newBatch = filteredPokemon.slice(0, prev.length + 30);
        return newBatch;
      });
    }
  }, [filteredPokemon, displayedPokemon.length, loading]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && !searching) {
      if (displayedPokemon.length >= filteredPokemon.length && hasMore) {
        loadMorePokemon();
      } else if (displayedPokemon.length < filteredPokemon.length) {
        setDisplayedPokemon(prev => {
          const newBatch = filteredPokemon.slice(0, prev.length + 30);
          return newBatch;
        });
      }
    }
  }, [loading, hasMore, displayedPokemon.length, filteredPokemon, searching]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setDisplayedPokemon([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Select Pokémon</h2>

        <SearchBar onSearch={handleSearch} />

        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div 
            className="grid grid-cols-4 gap-4 mt-4 max-h-[60vh] overflow-y-auto"
            onScroll={handleScroll}
          >
            {displayedPokemon.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className="p-2 border rounded-lg hover:bg-gray-50 text-center"
              >
                <Image
                  src={p.sprite}
                  alt={p.name}
                  width={64}
                  height={64}
                  className="mx-auto"
                />
                <p className="mt-1 text-sm capitalize">{p.name}</p>
                <p className="text-xs text-gray-500">#{p.id}</p>
              </button>
            ))}
            
            {(loading || searching) && (
              <div className="col-span-4 text-center py-4 text-gray-500">
                {searching ? 'Searching for Pokémon...' : 'Loading more Pokémon...'}
              </div>
            )}
            
            {!hasMore && displayedPokemon.length === 0 && !loading && !searching && (
              <div className="col-span-4 text-center py-4 text-gray-500">
                No Pokémon found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}