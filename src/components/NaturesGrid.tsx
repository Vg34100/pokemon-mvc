// src/components/NaturesGrid.tsx
import { Nature } from "@/models/Nature.model";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

export function NaturesGrid({ natures }: { natures: Nature[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {natures.map((nature) => (
        <div
          key={nature.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold capitalize mb-3">
            {nature.name} Nature
          </h2>
          
          <div className="space-y-2">
            {nature.increasedStat && (
              <div className="flex items-center gap-2 text-green-600">
                <ArrowUpIcon size={16} />
                <span>{nature.increasedStat}</span>
              </div>
            )}
            
            {nature.decreasedStat && (
              <div className="flex items-center gap-2 text-red-600">
                <ArrowDownIcon size={16} />
                <span>{nature.decreasedStat}</span>
              </div>
            )}
          </div>

          <div className="mt-3 text-sm text-gray-600">
            <div>Likes: {nature.likesFlavor}</div>
            <div>Dislikes: {nature.hatesFlavor}</div>
          </div>
        </div>
      ))}
    </div>
  );
}