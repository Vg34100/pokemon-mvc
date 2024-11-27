// src/components/GameVersionFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import { Game } from '@/models/Game.model';
import { Gamepad2 } from 'lucide-react';
import { GameController } from '@/controllers/Game.controller';

interface GameVersionFilterProps {
  onGameSelect: (gameId: number | null) => void;
}

/**
 * Component for filtering Pokemon by game version
 * Groups games by generation and allows selection
 */
export function GameVersionFilter({ onGameSelect }: GameVersionFilterProps) {
  const [games, setGames] = useState<{ [key: string]: Game[] }>({});
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load games on component mount
  useEffect(() => {
    const loadGames = async () => {
      const controller = new GameController();
      const { data, error } = await controller.getVersionGroups();
      
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      if (data) {
        // Group games by generation
        const groupedGames = controller.getGamesByGeneration(data);
        setGames(groupedGames);
      }
      
      setLoading(false);
    };

    loadGames();
  }, []);

  const handleGameClick = (gameId: number) => {
    const newGame = selectedGame === gameId ? null : gameId;
    setSelectedGame(newGame);
    onGameSelect(newGame);
  };

  if (loading) {
    return (
      <div className="mb-4">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-5 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 text-red-500 text-sm">
        Error loading game versions: {error}
      </div>
    );
  }

  return (
    <div className="mb-4 space-y-4">
      <h3 className="text-sm font-medium text-black flex items-center gap-2">
        <Gamepad2 className="w-4 h-4" />
        Select Game Version:
      </h3>
      
      {/* Display games grouped by generation */}
      {Object.entries(games).map(([generation, versionGames]) => (
        <div key={generation} className="space-y-2">
          <h4 className="text-xs font-medium text-gray-500 uppercase">
            {generation.replace('-', ' ')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {versionGames.map(game => (
              <button
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium
                  transition-colors duration-200
                  ${selectedGame === game.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}