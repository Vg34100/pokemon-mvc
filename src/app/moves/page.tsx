// src/app/moves/page.tsx
import { MovesGrid } from "@/components/MovesGrid";
import { MoveController } from "@/controllers/Move.controller";

export default async function MovesPage() {
  const controller = new MoveController();
  const { data: moves, error } = await controller.getMovesList();

  if (error) return <div>Error: {error}</div>;
  if (!moves) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-black">Pokémon Moves</h1>
        <MovesGrid moves={moves} />
      </div>
    </main>
  );
}