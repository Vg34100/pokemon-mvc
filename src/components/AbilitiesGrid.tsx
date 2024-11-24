// src/components/AbilitiesGrid.tsx
import { Ability } from "@/models/Ability.model";

export function AbilitiesGrid({ abilities }: { abilities: Ability[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {abilities.map((ability) => (
        <div
          key={ability.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold capitalize mb-2">
            {ability.name.replace("-", " ")}
          </h2>
          <p className="text-sm text-gray-600">{ability.shortEffect}</p>
        </div>
      ))}
    </div>
  );
}