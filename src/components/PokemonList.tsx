// src/components/PokemonList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Pokemon } from '@/models/Pokemon.model';
import { PokemonGrid } from './PokemonGrid';
import { SearchBar } from './SearchBar';
import { TypeFilter } from './TypeFilter';
import { GenerationFilter } from './GenerationFilter';

interface PokemonListProps {
  initialPokemon: Pokemon[];
}

export function PokemonList({ initialPokemon }: PokemonListProps) {
  const [filteredPokemon, setFilteredPokemon] = useState(initialPokemon);
  const [filters, setFilters] = useState({
    search: '',
    types: [] as string[],
    generation: null as number | null
  });

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

  useEffect(() => {
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

    // Apply generation filter
    if (filters.generation) {
      const [min, max] = getGenerationRange(filters.generation);
      filtered = filtered.filter(pokemon =>
        pokemon.id >= min && pokemon.id <= max
      );
    }

    setFilteredPokemon(filtered);
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

  return (
    <div className="space-y-4">
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-wrap gap-4">
        <TypeFilter onTypeSelect={handleTypeSelect} />
        <GenerationFilter onGenerationSelect={handleGenerationSelect} />
      </div>
      <PokemonGrid pokemon={filteredPokemon} />
    </div>
  );
}