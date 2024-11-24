import { PokemonController } from "@/controllers/Pokemon.controller";
import { LoadingState } from "@/components/LoadingState";
import { PokemonList } from "@/components/PokemonList";

export default async function PokemonGridPage() {
  const controller = new PokemonController();
  const { data: pokemon, error } = await controller.getPokemonList();

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