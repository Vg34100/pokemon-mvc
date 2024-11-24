// src/components/PokemonList.tsx
'use client';

import { useState } from 'react';
import { Pokemon } from '@/models/Pokemon.model';
import { PokemonGrid } from './PokemonGrid';
import { SearchBar } from './SearchBar';

interface PokemonListProps {
  initialPokemon: Pokemon[];
}

export function PokemonList({ initialPokemon }: PokemonListProps) {
  const [filteredPokemon, setFilteredPokemon] = useState(initialPokemon);

  const handleSearch = (term: string) => {
    const filtered = initialPokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(term.toLowerCase()) ||
      pokemon.id.toString().includes(term)
    );
    setFilteredPokemon(filtered);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <PokemonGrid pokemon={filteredPokemon} />
    </>
  );
}