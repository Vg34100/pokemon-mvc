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
        <PokemonGrid pokemon={pokemon} />
      </div>
    </main>
  );
}