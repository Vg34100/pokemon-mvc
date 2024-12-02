// src/components/PokemonList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Pokemon } from '@/models/Pokemon.model';
import { PokemonGrid } from './PokemonGrid';
import { SearchBar } from './SearchBar';
import { TypeFilter } from './TypeFilter';
import { GenerationFilter } from './GenerationFilter';
import { GameVersionFilter } from './GameVersionFilter';
import { LoadingState } from './LoadingState';
import { GameController } from '@/controllers/Game.Controller';

interface PokemonListProps {
  initialPokemon: Pokemon[];
}

const getGenerationRange = (gen: number): [number, number] => {
  const ranges: { [key: number]: [number, number] } = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 898],
    9: [899, 1025]
  };
  return ranges[gen];
};

export function PokemonList({ initialPokemon }: PokemonListProps) {
  const [filteredPokemon, setFilteredPokemon] = useState(initialPokemon);
  const [loading, setLoading] = useState(false);
  const [dexNumbers, setDexNumbers] = useState<{ [key: number]: number }>({});
  const [filters, setFilters] = useState({
    search: '',
    types: [] as string[],
    generation: null as number | null,
    gameId: null as number | null
  });

  useEffect(() => {
    const applyFilters = async () => {
      let filtered = initialPokemon;

      // Apply search filter
      if (filters.search) {
        filtered = filtered.filter(pokemon => 
          pokemon.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          pokemon.id.toString().includes(filters.search)
        );
      }

      // Apply type filter
      if (filters.types.length > 0) {
        filtered = filtered.filter(pokemon =>
          filters.types.every(type => pokemon.types.includes(type))
        );
      }

      // Apply game version filter
      if (filters.gameId) {
        setLoading(true);
        try {
          const controller = new GameController();
          const { data: versionPokemon, dexNumbers: newDexNumbers } = 
            await controller.getVersionGroupPokemon(filters.gameId);
            
          if (versionPokemon && newDexNumbers) {
            const versionIds = new Set(versionPokemon);
            filtered = filtered.filter(pokemon => versionIds.has(pokemon.id));
            
            // Sort by regional dex number
            setDexNumbers(newDexNumbers);
            filtered = filtered.sort((a, b) => 
              (newDexNumbers[a.id] || a.id) - (newDexNumbers[b.id] || b.id)
            );
          }
        } catch (error) {
          console.error('Failed to filter by version group:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setDexNumbers({});
        // Sort by national dex when no game is selected
        filtered = filtered.sort((a, b) => a.id - b.id);
      }

      // Apply generation filter
      if (filters.generation) {
        const [min, max] = getGenerationRange(filters.generation);
        filtered = filtered.filter(pokemon =>
          pokemon.id >= min && pokemon.id <= max
        );
      }

      setFilteredPokemon(filtered);
    };

    applyFilters();
  }, [filters, initialPokemon]);

  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, search: term }));
  };

  const handleTypeSelect = (types: string[]) => {
    setFilters(prev => ({ ...prev, types }));
  };

  const handleGenerationSelect = (generation: number | null) => {
    setFilters(prev => ({ ...prev, generation }));
  };

  const handleGameSelect = (gameId: number | null) => {
    setFilters(prev => ({ ...prev, gameId }));
  };

  return (
    <div className="space-y-4">
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-wrap gap-4">
        <GameVersionFilter onGameSelect={handleGameSelect} />
        <TypeFilter onTypeSelect={handleTypeSelect} />
        <GenerationFilter onGenerationSelect={handleGenerationSelect} />
      </div>
      
      {filters.gameId && !loading && (
        <div className="text-sm text-gray-600">
          Showing {filteredPokemon.length} Pokémon available in this version
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <PokemonGrid 
          pokemon={filteredPokemon}
          selectedGameId={filters.gameId}
          dexNumbers={dexNumbers}
        />
      )}
    </div>
  );
}