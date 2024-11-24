// src/components/AbilitiesGrid.tsx
'use client';

import { useState } from 'react';
import { Ability } from "@/models/Ability.model";
import { ChevronDown, ChevronUp } from 'lucide-react';

export function AbilitiesGrid({ abilities }: { abilities: Ability[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {abilities.map((ability) => (
        <div
          key={ability.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <button
            onClick={() => toggleExpand(ability.id)}
            className="w-full text-left flex justify-between items-start"
          >
            <h2 className="text-lg font-semibold capitalize">
              {ability.name.replace("-", " ")}
            </h2>
            {expandedId === ability.id ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>
          
          <p className="text-sm text-gray-600 mt-2">{ability.shortEffect}</p>
          
          {expandedId === ability.id && (
            <p className="text-sm text-gray-500 mt-4 pt-4 border-t">
              {ability.effect}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}