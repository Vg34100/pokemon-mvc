// src/app/pokedex/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { PokemonController } from "@/controllers/Pokemon.controller";
import { LoadingState } from "@/components/LoadingState";
import { PokemonList } from "@/components/PokemonList";
import type { Pokemon } from "@/models/Pokemon.model";

export default function PokemonGridPage() {
  const [pokemon, setPokemon] = useState<Pokemon[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemon = async () => {
      const controller = new PokemonController();
      const { data, error } = await controller.getPokemonList();
      
      if (error) {
        setError(error);
      } else {
        setPokemon(data);
      }
    };

    loadPokemon();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!pokemon) return <LoadingState />;

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto p-4">
        <PokemonList initialPokemon={pokemon} />
      </div>
    </main>
  );
}