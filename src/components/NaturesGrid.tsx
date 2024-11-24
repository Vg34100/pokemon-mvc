// src/components/NaturesGrid.tsx
import { Nature } from "@/models/Nature.model";
import { NatureStatsChart } from "./NatureStatsChart";


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
            
            <NatureStatsChart 
              increasedStat={nature.increasedStat}
              decreasedStat={nature.decreasedStat}
            />
  
            <div className="mt-3 text-sm text-gray-600">
              <div>Likes: <span className="capitalize">{nature.likesFlavor}</span></div>
              <div>Dislikes: <span className="capitalize">{nature.hatesFlavor}</span></div>
            </div>
          </div>
        ))}
      </div>
    );
  }