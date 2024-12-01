'use client';

import { useState, useEffect, useRef } from 'react';
import { Pokemon } from '@/models/Pokemon.model';
import { PokemonGrid } from './PokemonGrid';
import { SearchBar } from './SearchBar';
import { TypeFilter } from './TypeFilter';
import { GenerationFilter } from './GenerationFilter';
import { GameVersionFilter } from './GameVersionFilter';
import { LoadingState } from './LoadingState';
import { PokemonController } from '@/controllers/Pokemon.controller';
import { GameController } from '@/controllers/Game.controller';

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
    9: [899, 1025],
  };
  return ranges[gen];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PokemonList({ initialPokemon }: PokemonListProps) {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollPositionRef = useRef(0);

  const [filters, setFilters] = useState({
    search: '',
    types: [] as string[],
    generation: null as number | null,
    gameId: null as number | null,
  });

  // Fetch more Pokémon
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
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...allPokemon];

      // Apply generation filter
      if (filters.generation) {
        const [min, max] = getGenerationRange(filters.generation);
        filtered = filtered.filter((pokemon) => pokemon.id >= min && pokemon.id <= max);
      }

      // Apply search filter
      if (filters.search) {
        filtered = filtered.filter(
          (pokemon) =>
            pokemon.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            pokemon.id.toString().includes(filters.search)
        );
      }

      // Apply type filter
      if (filters.types.length > 0) {
        filtered = filtered.filter((pokemon) =>
          filters.types.every((type) => pokemon.types.includes(type))
        );
      }

      // Apply game version filter
      if (filters.gameId) {
        const controller = new GameController();
        controller
          .getVersionGroupPokemon(filters.gameId)
          .then(({ data: versionPokemon }) => {
            if (versionPokemon) {
              const versionIds = new Set(versionPokemon);
              filtered = filtered.filter((pokemon) => versionIds.has(pokemon.id));
              setFilteredPokemon(filtered);
            }
          })
          .catch((error) => console.error('Failed to filter by version group:', error));
      } else {
        setFilteredPokemon(filtered);
      }

      filtered.sort((a, b) => a.id - b.id);
      
      // Only reset displayed Pokemon if filters change
      if (displayedPokemon.length === 0) {
        setDisplayedPokemon(filtered.slice(0, 30));
      }
    };

    applyFilters();
  }, [filters, allPokemon]);

  // Load more filtered results
  useEffect(() => {
    if (!loading && filteredPokemon.length > displayedPokemon.length) {
      setDisplayedPokemon(prev => {
        const nextBatch = filteredPokemon.slice(0, prev.length + 30);
        return nextBatch;
      });
    }
  }, [filteredPokemon, displayedPokemon.length, loading]);

  // Save and restore scroll position
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositionRef.current = window.scrollY;
    };

    const restoreScrollPosition = () => {
      window.scrollTo(0, scrollPositionRef.current);
    };

    window.addEventListener('scroll', saveScrollPosition);
    return () => {
      window.removeEventListener('scroll', saveScrollPosition);
      restoreScrollPosition();
    };
  }, [filters]);

  // Handle infinite scroll
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
      hasMore &&
      !loading
    ) {
      loadMorePokemon();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  // Filter handlers
  const handleFilterChange = (updatedFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
    setDisplayedPokemon([]);
    setOffset(0);
    setHasMore(true);
  };

  const handleSearch = (term: string) => handleFilterChange({ search: term });
  const handleTypeSelect = (types: string[]) => handleFilterChange({ types });
  const handleGenerationSelect = (generation: number | null) =>
    handleFilterChange({ generation });
  const handleGameSelect = (gameId: number | null) =>
    handleFilterChange({ gameId });

  return (
    <div className="space-y-4">
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-wrap gap-4">
        <GameVersionFilter onGameSelect={handleGameSelect} />
        <TypeFilter onTypeSelect={handleTypeSelect} />
        <GenerationFilter onGenerationSelect={handleGenerationSelect} />
      </div>

      {/* Results count */}
      {filters.gameId && !loading && (
        <div className="text-sm text-gray-600">
          Showing {filteredPokemon.length} Pokémon available in this version
        </div>
      )}

      {/* Pokémon grid with loading state */}
      {loading && displayedPokemon.length === 0 ? (
        <LoadingState />
      ) : (
        <PokemonGrid pokemon={displayedPokemon} selectedGameId={filters.gameId} />
      )}

      {/* Pagination loading indicator */}
      {loading && displayedPokemon.length > 0 && (
        <div className="text-center text-gray-500">Loading more Pokémon...</div>
      )}

      {/* No more Pokémon */}
      {!hasMore && !loading && displayedPokemon.length > 0 && (
        <div className="text-center text-gray-500">No more Pokémon to load</div>
      )}
    </div>
  );
}