// src/components/GenerationFilter.tsx
'use client';

import { useState } from 'react';

interface GenerationFilterProps {
  onGenerationSelect: (generation: number | null) => void;
}

export function GenerationFilter({ onGenerationSelect }: GenerationFilterProps) {
  const [selectedGen, setSelectedGen] = useState<number | null>(null);
  
  const generations = [
    { id: 1, range: '1-151' },
    { id: 2, range: '152-251' },
    { id: 3, range: '252-386' },
    { id: 4, range: '387-493' },
    { id: 5, range: '494-649' },
    { id: 6, range: '650-721' },
    { id: 7, range: '722-809' },
    { id: 8, range: '810-898' },
    { id: 9, range: '899-1025'}
  ];

  const handleGenClick = (genId: number) => {
    const newGen = selectedGen === genId ? null : genId;
    setSelectedGen(newGen);
    onGenerationSelect(newGen);
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2 text-black">Filter by generation:</h3>
      <div className="flex flex-wrap gap-2">
        {generations.map(gen => (
          <button
            key={gen.id}
            onClick={() => handleGenClick(gen.id)}
            className={`px-3 py-1 rounded-full text-sm text-black
              ${selectedGen === gen.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            Gen {gen.id}
          </button>
        ))}
      </div>
    </div>
  );
}
