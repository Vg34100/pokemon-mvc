// src/components/GameVersionFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import { Game } from '@/models/VersionGroup.model';
import { Gamepad2, ChevronDown, ChevronRight } from 'lucide-react';
import { GameController } from '@/controllers/VersionGroup.controller';

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
  const [expandedGeneration, setExpandedGeneration] = useState<string | null>(null);

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

      // Group games by generation
      if (data) {
        const groupedGames = controller.getGamesByGeneration(data);
        setGames(groupedGames);
      }

      setLoading(false);
    };

    loadGames();
  }, []);

  const toggleGeneration = (generation: string) => {
    setExpandedGeneration((prev) => (prev === generation ? null : generation));
  };

  const handleGameClick = (gameId: number) => {
    const newGame = selectedGame === gameId ? null : gameId;
    setSelectedGame(newGame);
    onGameSelect(newGame);
  };

  const formatGenerationText = (generation: string) => {
    const [prefix, romanNumeral] = generation.split('-');
    return `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} ${romanNumeral.toUpperCase()}`;
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
    <div className="mb-4">
      <h3 className="text-sm font-medium text-black flex items-center gap-2 mb-2">
        <Gamepad2 className="w-4 h-4" />
        Select Game Version:
      </h3>

      {/* Display games grouped by generation */}
      <div className="flex flex-wrap gap-4 border-b pb-2 mb-4">
        {Object.keys(games).map((generation) => (
          <div
            key={generation}
            className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full
              ${expandedGeneration === generation
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-black'
              }`}
            onClick={() => toggleGeneration(generation)}
          >
            <span className="text-sm font-medium">
              {formatGenerationText(generation)}
            </span>
            {expandedGeneration === generation ? (
              <ChevronDown className="w-4 h-4 text-current" />
            ) : (
              <ChevronRight className="w-4 h-4 text-current" />
            )}
          </div>
        ))}
      </div>

      {/* Display games for the selected generation */}
      {expandedGeneration && (
        <div className="flex flex-wrap gap-2">
          {games[expandedGeneration]?.map((game) => (
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
      )}
    </div>
  );
}