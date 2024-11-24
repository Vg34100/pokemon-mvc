// src/components/PokemonList.tsx
'use client';

import { useState } from 'react';
import { Pokemon } from '@/models/Pokemon.model';
import { PokemonGrid } from './PokemonGrid';
import { SearchBar } from './SearchBar';
import { TypeFilter } from './TypeFilter';

interface PokemonListProps {
  initialPokemon: Pokemon[];
}

export function PokemonList({ initialPokemon }: PokemonListProps) {
  const [filteredPokemon, setFilteredPokemon] = useState(initialPokemon);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const applyFilters = (search: string, types: string[]) => {
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

    setFilteredPokemon(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedTypes);
  };

  const handleTypeSelect = (types: string[]) => {
    setSelectedTypes(types);
    applyFilters(searchTerm, types);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <TypeFilter onTypeSelect={handleTypeSelect} />
      <PokemonGrid pokemon={filteredPokemon} />
    </>
  );
}