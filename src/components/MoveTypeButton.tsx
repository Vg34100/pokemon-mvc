// src/components/MoveTypeButton.tsx
interface MoveTypeProps {
    type: string;
    className?: string;
  }
  
const typeColors: { [key: string]: { bg: string; text: string } } = {
    normal: { bg: "bg-gray-100", text: "text-gray-800" },
    fire: { bg: "bg-red-100", text: "text-red-800" },
    water: { bg: "bg-blue-100", text: "text-blue-800" },
    electric: { bg: "bg-yellow-100", text: "text-yellow-800" },
    grass: { bg: "bg-green-100", text: "text-green-800" },
    ice: { bg: "bg-cyan-100", text: "text-cyan-800" },
    fighting: { bg: "bg-orange-100", text: "text-orange-800" },
    poison: { bg: "bg-purple-100", text: "text-purple-800" },
    ground: { bg: "bg-amber-100", text: "text-amber-800" },
    flying: { bg: "bg-indigo-100", text: "text-indigo-800" },
    psychic: { bg: "bg-pink-100", text: "text-pink-800" },
    bug: { bg: "bg-lime-100", text: "text-lime-800" },
    rock: { bg: "bg-stone-100", text: "text-stone-800" },
    ghost: { bg: "bg-purple-100", text: "text-purple-800" },
    dragon: { bg: "bg-violet-100", text: "text-violet-800" },
    dark: { bg: "bg-neutral-100", text: "text-neutral-800" },
    steel: { bg: "bg-zinc-100", text: "text-zinc-800" },
    fairy: { bg: "bg-rose-100", text: "text-rose-800" }
  };
  
export function MoveTypeButton({ type, className = "" }: MoveTypeProps) {
    const colors = typeColors[type] || typeColors.normal;
    
    return (
      <span className={`px-2 py-1 rounded text-sm capitalize ${colors.bg} ${colors.text} ${className}`}>
        {type}
      </span>
    );
  }