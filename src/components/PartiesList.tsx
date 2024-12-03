// src/components/PartiesList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Party } from '@/services/Database.interface';
import { PartyController } from '@/controllers/Party.controller';
import { PlusCircle } from 'lucide-react';
import { PartyCard } from './PartyCard';
import { CreatePartyModal } from './CreatePartyModal';

export function PartiesList() {
  const { username } = useAuth();
  const [parties, setParties] = useState<Party[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const controller = new PartyController();

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    loadParties();
  }, [username]);

  const loadParties = async () => {
    if (!username) return;

    setLoading(true);
    const { data, error } = await controller.getUserParties(username);
    
    if (error) {
      setError(error);
    } else if (data) {
      setParties(data);
    }
    
    setLoading(false);
  };

  const handleCreateParty = () => {
    setIsModalOpen(true);
  };

  const handlePartyCreated = () => {
    setIsModalOpen(false);
    loadParties();
  };

  if (!username) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to manage your parties</p>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={handleCreateParty}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <PlusCircle size={20} />
        Create New Party
      </button>

      {parties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No parties created yet</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {parties.map((party) => (
            <PartyCard
              key={party.id}
              party={party}
              onDelete={loadParties}
              onUpdate={loadParties}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <CreatePartyModal
          onClose={() => setIsModalOpen(false)}
          onPartyCreated={handlePartyCreated}
        />
      )}
    </div>
  );
}