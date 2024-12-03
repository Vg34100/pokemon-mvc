"use client";

import { useState, useEffect } from "react";
import { PokemonController } from "@/controllers/Pokemon.controller";
import { DescriptionController } from "@/controllers/Description.controller";
import { MoveController } from "@/controllers/Move.controller";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function PokemonPage({ params }: PageProps) {
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const [pokemon, setPokemon] = useState<any>(null);
  const [description, setDescription] = useState<string>("");
  const [moves, setMoves] = useState<any[]>([]);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMoves, setShowMoves] = useState(false);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setPokemonId(parseInt(resolvedParams.id, 10));
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (pokemonId === null) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const pokemonController = new PokemonController();
        const descriptionController = new DescriptionController();
        const moveController = new MoveController();

        const { data: pokemonList } = await pokemonController.getPokemonList();
        const foundPokemon = pokemonList?.find((p) => p.id === pokemonId);
        setPokemon(foundPokemon);

        const { data: descriptionData } = await descriptionController.getDescription(pokemonId);
        setDescription(descriptionData?.description || "Description not available.");

        const { data: moveList, error: moveFetchError } = await moveController.getMovesByPokemonId(
          pokemonId
        );
        setMoves(moveList || []);
        setMoveError(moveFetchError);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pokemonId]);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl text-gray-700">Loading...</p>
      </main>
    );

  if (!pokemon)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl text-gray-700">Pokémon not found</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="relative max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Pokémon Image */}
        <div className="bg-gray-600 flex justify-center p-8">
          <Image
            src={pokemon.sprite}
            alt={pokemon.name}
            width={250}
            height={250}
            className="object-contain"
          />
        </div>

        {/* Pokémon Type Badge */}
        <div className="absolute top-4 right-4">
          {pokemon.types.map((type: string) => (
            <span
              key={type}
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg capitalize text-white bg-${type}-500`}
              style={{ backgroundColor: getTypeColor(type) }}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Pokémon Details */}
        <div className="p-6">
          <h1 className="text-4xl font-bold font-pokemon text-gray-800 capitalize text-center">
            {pokemon.name}
          </h1>
          <p className="text-center text-gray-500 mt-2">Pokédex #{pokemon.id}</p>

          {/* Pokémon Description */}
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Description</h2>
            <p className="text-gray-600 mt-2">{description}</p>
          </div>
        </div>

        {/* Pokémon Moves Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Moves</h2>
            <button
              onClick={() => setShowMoves(!showMoves)}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              {showMoves ? "Collapse" : "Expand"}
            </button>
          </div>

          {showMoves && (
            moveError ? (
              <p className="text-gray-500">Failed to fetch moves: {moveError}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {moves.map((move: any, index: number) => (
                  <span
                    key={move.id || index}
                    className="inline-block bg-gray-200 text-gray-800 px-4 py-2 text-sm font-semibold rounded-lg capitalize"
                  >
                    {move.name.replace("-", " ")}
                  </span>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}

/**
 * Helper function to get type colors
 */
function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    bug: "#A8B820",
    dark: "#705848",
    dragon: "#7038F8",
    electric: "#F8D030",
    fairy: "#F0B6BC",
    fighting: "#C03028",
    fire: "#F08030",
    flying: "#A890F0",
    ghost: "#705898",
    grass: "#78C850",
    ground: "#E0C068",
    ice: "#98D8D8",
    normal: "#A8A878",
    poison: "#A040A0",
    psychic: "#F85888",
    rock: "#B8A038",
    steel: "#B8B8D0",
    water: "#6890F0",
  };

  return typeColors[type] || "#A8A8A8"; // Default color if type is unknown
}