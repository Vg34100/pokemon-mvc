// src/app/pokedex/page.tsx
import { PokemonController } from "@/controllers/Pokemon.controller";
import { LoadingState } from "@/components/LoadingState";
import { PokemonList } from "@/components/PokemonList";

export default async function PokemonGridPage() {
  const controller = new PokemonController();
  const { data: pokemonData, error } = await controller.getPokemonList(30, 0);

  if (error) return <div>Error: {error}</div>;
  if (!pokemonData) return <LoadingState />;

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto p-4">
        <PokemonList initialPokemon={pokemonData.pokemon} />
      </div>
    </main>
  );
}