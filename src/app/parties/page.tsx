// src/app/parties/page.tsx
import { PartiesList } from "@/components/PartiesList";
import { Suspense } from "react";

export default function PartiesPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Pokémon Parties</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <PartiesList />
        </Suspense>
      </div>
    </main>
  );
}