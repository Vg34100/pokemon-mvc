// src/components/TypeFilter.tsx
'use client';

import { useState } from 'react';

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
        {types.map(type => (
          <button
            key={type}
            onClick={() => handleTypeClick(type)}
            className={`px-3 py-1 rounded-full text-sm capitalize
              ${selectedTypes.includes(type)
                ? 'bg-blue-500 text-black'
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
