// src/app/natures/page.tsx
import { NaturesGrid } from "@/components/NaturesGrid";
import { NatureController } from "@/controllers/Nature.controller";

export default async function NaturesPage() {
  const controller = new NatureController();
  const { data: natures, error } = await controller.getNaturesList();

  if (error) return <div>Error: {error}</div>;
  if (!natures) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto p-4 text-black">
        <h1 className="text-2xl font-bold mb-6">Pokémon Natures</h1>
        <NaturesGrid natures={natures} />
      </div>
    </main>
  );
}