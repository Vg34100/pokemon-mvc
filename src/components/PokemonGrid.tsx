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
          className="border rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
        >
          <div className="relative w-24 h-24 mx-auto">
            <Image
              src={p.sprite}
              alt={p.name}
              fill
              sizes="(max-width: 96px) 100vw, 96px"
              priority={p.id <= 12}
              className="object-contain"
            />
          </div>
          <h2 className="mt-2 capitalize font-medium">{p.name}</h2>
        </Link>
      ))}
    </div>
  );
}