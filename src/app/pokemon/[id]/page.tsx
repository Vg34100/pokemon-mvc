// src/app/pokemon/[id]/page.tsx
import { PokemonController } from "@/controllers/Pokemon.controller";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function PokemonPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const pokemonId = parseInt(resolvedParams.id);
  
  const controller = new PokemonController();
  const { data: pokemonList } = await controller.getPokemonList();
  const pokemon = pokemonList?.find((p) => p.id === pokemonId);

  if (!pokemon) return <div>Pokemon not found</div>;

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={pokemon.sprite}
            alt={pokemon.name}
            fill
            priority
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold mt-4 capitalize">{pokemon.name}</h1>
      </div>
    </main>
  );
}