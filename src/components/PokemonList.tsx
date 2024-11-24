// src/components/PokemonList.tsx
'use client';

import { useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);

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

  const applyFilters = (search: string, types: string[], generation: number | null) => {
    let filtered = initialPokemon;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
        pokemon.id.toString().includes(search)
      );
    }

    // Apply type filter
    if (types.length > 0) {
      filtered = filtered.filter(pokemon =>
        types.every(type => pokemon.types.includes(type))
      );
    }

    // Apply generation filter
    if (generation) {
        const [min, max] = getGenerationRange(generation);
        filtered = filtered.filter(pokemon =>
          pokemon.id >= min && pokemon.id <= max
        );
      }

    setFilteredPokemon(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedTypes, selectedGeneration);
  };

  const handleTypeSelect = (types: string[]) => {
    setSelectedTypes(types);
    applyFilters(searchTerm, selectedTypes, selectedGeneration);
  };

  const handleGenerationSelect = (generation: number | null) => {
    setSelectedGeneration(generation);
    applyFilters(searchTerm, selectedTypes, generation);
  };


  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <TypeFilter onTypeSelect={handleTypeSelect} />
      <GenerationFilter  onGenerationSelect={handleGenerationSelect} />
      <PokemonGrid pokemon={filteredPokemon} />
    </>
  );
}