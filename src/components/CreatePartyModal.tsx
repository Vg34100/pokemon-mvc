// src/components/CreatePartyModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PartyController } from '@/controllers/Party.controller';
import { GameVersionFilter } from './GameVersionFilter';
import { X } from 'lucide-react';

interface CreatePartyModalProps {
  onClose: () => void;
  onPartyCreated: () => void;
}

export function CreatePartyModal({ onClose, onPartyCreated }: CreatePartyModalProps) {
  const { username } = useAuth();
  const [name, setName] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !selectedGameId) return;

    setError(null);
    setIsSubmitting(true);

    const controller = new PartyController();
    const { data, error: createError } = await controller.createParty(
      username,
      name,
      selectedGameId
    );

    if (createError) {
      setError(createError);
    } else if (data) {
      onPartyCreated();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Create New Party</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Party Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter party name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Game Version
            </label>
            <GameVersionFilter
              onGameSelect={(gameId) => setSelectedGameId(gameId)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedGameId || !name.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Party'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}