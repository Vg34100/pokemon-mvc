// src/components/SelectPokemonModal.tsx
'use client';

import { useState, useEffect } from 'react';
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
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPokemon();
  }, [gameId]);

  const loadPokemon = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load all Pokemon
      const pokemonController = new PokemonController();
      const gameController = new GameController();

      const [pokemonResult, versionResult] = await Promise.all([
        pokemonController.getPokemonList(),
        gameController.getVersionGroupPokemon(gameId)
      ]);

      if (pokemonResult.error) throw new Error(pokemonResult.error);
      if (versionResult.error) throw new Error(versionResult.error);
      if (!pokemonResult.data || !versionResult.data) throw new Error('Failed to load data');
      if (!versionResult.data) throw new Error('Failed to load version data');

      // Filter Pokemon available in this game version
      const availablePokemon = pokemonResult.data.filter(p => 
        versionResult.data!.includes(p.id)  // Using ! to assert non-null
      );

      setPokemon(availablePokemon);
      setFilteredPokemon(availablePokemon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Pokemon');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    const filtered = pokemon.filter(p => 
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.id.toString().includes(term)
    );
    setFilteredPokemon(filtered);
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

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-4 gap-4 mt-4 max-h-[60vh] overflow-y-auto">
            {filteredPokemon.map((p) => (
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
          </div>
        )}
      </div>
    </div>
  );
}