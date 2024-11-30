// src/components/PokemonList.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Pokemon } from '@/models/Pokemon.model';
import { PokemonGrid } from './PokemonGrid';
import { SearchBar } from './SearchBar';
import { TypeFilter } from './TypeFilter';
import { GenerationFilter } from './GenerationFilter';
import { GameVersionFilter } from './GameVersionFilter';
import { LoadingState } from './LoadingState';
import { GameController } from '@/controllers/Game.controller';
import { PokemonController } from '@/controllers/Pokemon.controller';

interface PokemonListProps {
  initialPokemon: Pokemon[];
}

const ITEMS_PER_PAGE = 30;

export function PokemonList({ initialPokemon }: PokemonListProps) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>(initialPokemon);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>(initialPokemon);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(ITEMS_PER_PAGE);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState({
    search: '',
    types: [] as string[],
    generation: null as number | null,
    gameId: null as number | null
  });

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePokemon();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, loading]);

  const loadMorePokemon = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const controller = new PokemonController();
    const { data: newPokemonData } = await controller.getPokemonList(ITEMS_PER_PAGE, offset);

    if (newPokemonData) {
      setPokemonList(prev => [...prev, ...newPokemonData.pokemon]);
      setHasMore(newPokemonData.hasNext);
      setTotalCount(newPokemonData.count);
      setOffset(prev => prev + ITEMS_PER_PAGE);
    }

    setLoading(false);
  };

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = pokemonList;

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
  }, [filters, pokemonList]);

  // Filter handlers
  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, search: term }));
  };

  const handleTypeSelect = (types: string[]) => {
    setFilters(prev => ({ ...prev, types }));
  };

  const handleGenerationSelect = (generation: number | null) => {
    setFilters(prev => ({ ...prev, generation }));
  };

  const handleGameSelect = async (gameId: number | null) => {
    setFilters(prev => ({ ...prev, gameId }));
    
    if (gameId) {
      setLoading(true);
      try {
        const controller = new GameController();
        const { data: versionPokemon } = await controller.getVersionGroupPokemon(gameId);
        if (versionPokemon) {
          const versionIds = new Set(versionPokemon);
          setFilteredPokemon(pokemonList.filter(pokemon => versionIds.has(pokemon.id)));
        }
      } catch (error) {
        console.error('Failed to filter by version group:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredPokemon(pokemonList);
    }
  };

  return (
    <div className="space-y-4">
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-wrap gap-4">
        <GameVersionFilter onGameSelect={handleGameSelect} />
        <TypeFilter onTypeSelect={handleTypeSelect} />
        <GenerationFilter onGenerationSelect={handleGenerationSelect} />
      </div>
      
      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredPokemon.length} of {totalCount} Pokémon
      </div>

      {/* Pokemon grid */}
      <PokemonGrid 
        pokemon={filteredPokemon}
        selectedGameId={filters.gameId}
      />

      {/* Loading indicator */}
      {loading && <LoadingState />}

      {/* Intersection observer element */}
      {!loading && hasMore && (
        <div ref={loadingRef} className="h-10" />
      )}
    </div>
  );
}

// Helper function for generation ranges
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
  return ranges[gen] || [0, 0];
};