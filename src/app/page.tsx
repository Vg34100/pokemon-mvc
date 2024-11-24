import { PokemonGrid } from "@/components/PokemonGrid";
import { PokemonController } from "../controllers/Pokemon.controller";
import { LoadingState } from "@/components/LoadingState";


export default async function Home() {
  const controller = new PokemonController();
  const { data: pokemon, error } = await controller.getPokemonList();

  if (error) return <div>Error: {error}</div>;
  if (!pokemon) return <LoadingState />;


  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search Pokémon..."
            className="w-full p-2 pl-8 border rounded shadow-sm text-gray-400"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        <PokemonGrid pokemon={pokemon} />
      </div>
    </main>
  );
}