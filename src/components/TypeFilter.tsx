// src/components/TypeFilter.tsx
'use client';

import { useState } from 'react';
import { typeColors } from './MoveTypeButton';

interface TypeFilterProps {
  onTypeSelect: (types: string[]) => void;
}

export function TypeFilter({ onTypeSelect }: TypeFilterProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const types = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  const handleTypeClick = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];

    setSelectedTypes(newTypes);
    onTypeSelect(newTypes);
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2 text-black">Filter by type:</h3>
      <div className="flex flex-wrap gap-2 text-black">
        {types.map(type => {
          const colors = typeColors[type] || { bg: 'bg-gray-100', text: 'text-black' };

          return (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              className={`px-3 py-1 rounded-full text-sm capitalize transition-colors
                ${colors.bg} ${colors.text} 
                ${selectedTypes.length > 0 && !selectedTypes.includes(type) 
                  ? 'opacity-50 hover:opacity-75' 
                  : 'opacity-100'
                }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}