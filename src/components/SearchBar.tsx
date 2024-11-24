// src/components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search Pokémon..."
        className="w-full p-2 pl-8 border rounded shadow-sm text-black"
      />
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
    </div>
  );
}