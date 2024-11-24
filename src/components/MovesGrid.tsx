// src/components/MovesGrid.tsx
import { Move } from "@/models/Move.model";

export function MovesGrid({ moves }: { moves: Move[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-black">
      {moves.map((move) => (
        <div
          key={move.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold capitalize">{move.name.replace("-", " ")}</h2>
            <span className={`px-2 py-1 rounded text-sm capitalize bg-${move.type}-100 text-${move.type}-800`}>
              {move.type}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
            <div>
              <span className="text-gray-600">Power:</span>
              <br />
              {move.power || "-"}
            </div>
            <div>
              <span className="text-gray-600">Accuracy:</span>
              <br />
              {move.accuracy ? `${move.accuracy}%` : "-"}
            </div>
            <div>
              <span className="text-gray-600">PP:</span>
              <br />
              {move.pp}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{move.shortEffect}</p>
        </div>
      ))}
    </div>
  );
}