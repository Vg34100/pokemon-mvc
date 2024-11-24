// src/components/PokemonGrid.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Pokemon } from '@/models/Pokemon.model';

export function PokemonGrid({ pokemon }: { pokemon: Pokemon[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {pokemon.map((p) => (
        <Link
          href={`/pokemon/${p.id}`}
          key={p.id}
          className=" relative bg-gray-200 text-pokedexBlack rounded-lg p-4 text-center hover:shadow-pokedexGray transition-shadow"
        >
          <p className="absolute top-1 left-2 text-sm text-gray-500">#{(p.id).toString().padStart(4, "0")}</p>
          <div className="relative w-full h-24 mx-auto">
            <Image
              src={p.sprite}
              alt={p.name}
              fill
              sizes="(max-width: 96px) 100vw, 96px"
              priority={p.id <= 12}
              className="object-contain"
            />
          </div>
          <h2 className="mt-2 capitalize font-pokemon">{p.name}</h2>
        </Link>
      ))}
    </div>
  );
}