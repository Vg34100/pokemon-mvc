// src/components/PartyCard.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Party } from '@/services/Database.interface';
import { PartyController } from '@/controllers/Party.controller';
import { Trash2, Plus } from 'lucide-react';
import { SelectPokemonModal } from './SelectPokemonModal';
import { GameController } from '@/controllers/Game.Controller';

interface PartyCardProps {
  party: Party;
  onDelete: () => void;
  onUpdate: () => void;
}

export function PartyCard({ party, onDelete, onUpdate }: PartyCardProps) {
  const [gameName, setGameName] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGameName();
  }, [party.gameId]);

  const loadGameName = async () => {
    const controller = new GameController();
    const { data: games } = await controller.getVersionGroups();
    if (games) {
      const game = games.find(g => g.id === party.gameId);
      if (game) {
        setGameName(game.name);
      }
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    
    const controller = new PartyController();
    const { error: deleteError } = await controller.deleteParty(party.userId, party.id);
    
    if (deleteError) {
      setError(deleteError);
    } else {
      onDelete();
    }
    
    setIsDeleting(false);
  };

  const handlePokemonSelect = async (pokemonId: number) => {
    if (selectedSlot === null) return;

    const controller = new PartyController();
    const { error: updateError } = await controller.updatePartyPokemon(
      party,
      selectedSlot,
      pokemonId
    );

    if (updateError) {
      setError(updateError);
    } else {
      onUpdate();
    }
    
    setSelectedSlot(null);
  };

  const renderPokemonSlot = (index: number) => {
    const pokemonId = party.pokemon[index];

    return (
      <button
        key={index}
        onClick={() => setSelectedSlot(index)}
        className={`relative w-24 h-24 border rounded-lg 
          ${pokemonId ? 'bg-gray-100' : 'bg-gray-50 border-dashed'}
          hover:bg-gray-200 transition-colors`}
      >
        {pokemonId ? (
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
            alt={`Pokemon ${pokemonId}`}
            width={96}
            height={96}
            className="object-contain"
          />
        ) : (
          <Plus className="absolute inset-0 m-auto text-gray-400" size={24} />
        )}
      </button>
    );
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{party.name}</h3>
          <p className="text-sm text-gray-600">{gameName}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => renderPokemonSlot(i))}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {selectedSlot !== null && (
        <SelectPokemonModal
          gameId={party.gameId}
          onSelect={handlePokemonSelect}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
}