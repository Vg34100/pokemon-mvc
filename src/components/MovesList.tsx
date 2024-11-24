// src/components/MovesList.tsx
'use client';

import { useState } from 'react';
import { Move } from '@/models/Move.model';
import { MovesGrid } from './MovesGrid';
import { Search } from 'lucide-react';
import { MoveTypeButton } from './MoveTypeButton';

interface MovesListProps {
  moves: Move[];
}

export function MovesList({ moves }: MovesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const types = Array.from(new Set(moves.map(move => move.type)));
  const damageClasses = Array.from(new Set(moves.map(move => move.damageClass)));

  const filteredMoves = moves.filter(move => {
    const matchesSearch = move.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || move.type === selectedType;
    const matchesClass = !selectedClass || move.damageClass === selectedClass;
    return matchesSearch && matchesType && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search moves..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Type</h3>
          <div className="flex flex-wrap gap-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className={`transition-opacity ${selectedType && selectedType !== type ? 'opacity-50' : ''}`}
              >
                <MoveTypeButton type={type} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Category</h3>
          <div className="flex flex-wrap gap-2">
            {damageClasses.map(damageClass => (
              <button
                key={damageClass}
                onClick={() => setSelectedClass(selectedClass === damageClass ? null : damageClass)}
                className={`px-2 py-1 rounded text-sm capitalize
                  ${selectedClass === damageClass
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                {damageClass}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredMoves.length} of {moves.length} moves
      </div>

      {/* Moves Grid */}
      <MovesGrid moves={filteredMoves} />
    </div>
  );
}