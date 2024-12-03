// src/components/MovesGrid.tsx
import { Move } from "@/models/Move.model";
import { MoveTypeButton } from "./MoveTypeButton";

export function MovesGrid({ moves }: { moves: Move[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {moves.map((move) => (
        <div
          key={move.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold capitalize">{move.name.replace("-", " ")}</h2>
            <div className="flex gap-2">
              <MoveTypeButton type={move.type} />
              <span className="px-2 py-1 rounded text-sm capitalize bg-gray-100 text-gray-800">
                {move.damageClass}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
            <div>
              <span className="text-gray-600">Power:</span>
              <br />
              <span className="font-medium">{move.power || "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">Accuracy:</span>
              <br />
              <span className="font-medium">{move.accuracy ? `${move.accuracy}%` : "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">PP:</span>
              <br />
              <span className="font-medium">{move.pp}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{move.shortEffect}</p>
        </div>
      ))}
    </div>
  );
}