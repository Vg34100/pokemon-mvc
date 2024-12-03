// src/components/MoveTypeButton.tsx
interface MoveTypeProps {
  type: string;
  className?: string;
}

export const typeColors: { [key: string]: { bg: string; text: string } } = {
  normal: { bg: "bg-gray-300", text: "text-gray-900" },
  fire: { bg: "bg-red-500", text: "text-white" },
  water: { bg: "bg-blue-500", text: "text-white" },
  electric: { bg: "bg-yellow-400", text: "text-black" },
  grass: { bg: "bg-green-500", text: "text-white" },
  ice: { bg: "bg-cyan-300", text: "text-black" },
  fighting: { bg: "bg-orange-600", text: "text-white" },
  poison: { bg: "bg-purple-500", text: "text-white" },
  ground: { bg: "bg-yellow-600", text: "text-black" },
  flying: { bg: "bg-indigo-400", text: "text-white" },
  psychic: { bg: "bg-pink-500", text: "text-white" },
  bug: { bg: "bg-lime-500", text: "text-black" },
  rock: { bg: "bg-stone-500", text: "text-white" },
  ghost: { bg: "bg-purple-800", text: "text-white" },
  dragon: { bg: "bg-violet-700", text: "text-white" },
  dark: { bg: "bg-neutral-800", text: "text-white" },
  steel: { bg: "bg-gray-500", text: "text-white" },
  fairy: { bg: "bg-pink-300", text: "text-black" }
};

export function MoveTypeButton({ type, className = "" }: MoveTypeProps) {
  const colors = typeColors[type] || typeColors.normal;
  
  return (
    <span className={`px-2 py-1 rounded text-sm capitalize ${colors.bg} ${colors.text} ${className}`}>
      {type}
    </span>
  );
}