// src/app/abilities/page.tsx
import { AbilitiesGrid } from "@/components/AbilitiesGrid";
import { AbilityController } from "@/controllers/Ability.controller";

export default async function AbilitiesPage() {
  const controller = new AbilityController();
  const { data: abilities, error } = await controller.getAbilitiesList();

  if (error) return <div>Error: {error}</div>;
  if (!abilities) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto p-4 text-black">
        <h1 className="text-2xl font-bold mb-6">Pokémon Abilities</h1>
        <AbilitiesGrid abilities={abilities} />
      </div>
    </main>
  );
}
