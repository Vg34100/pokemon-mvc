import { PokemonGrid } from "@/components/PokemonGrid";
import { PokemonController } from "../controllers/Pokemon.controller";


export default async function Home() {
  const controller = new PokemonController();
  const { data: pokemon, error } = await controller.getPokemonList();

  if (error) return <div>Error: {error}</div>;
  if (!pokemon) return <div>Loading...</div>;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pokédex</h1>
      <PokemonGrid pokemon={pokemon} />
    </main>
  );
}