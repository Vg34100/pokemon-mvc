// src/components/NatureStatsChart.tsx
interface NatureStatsProps {
  increasedStat: string | null;
  decreasedStat: string | null;
}

export function NatureStatsChart({ increasedStat, decreasedStat }: NatureStatsProps) {
  const stats = ['Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
  
  return (
    <div className="grid grid-cols-5 gap-1 mt-2">
      {stats.map((stat) => (
        <div key={stat} className="text-center">
          <div className="text-xs text-gray-600">{stat}</div>
          <div 
            className={`h-2 rounded mt-1 ${
              stat === increasedStat 
                ? 'bg-green-500' 
                : stat === decreasedStat 
                  ? 'bg-red-500' 
                  : 'bg-gray-200'
            }`}
          />
        </div>
      ))}
    </div>
  );
}