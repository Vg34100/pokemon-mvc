import { ItemsGrid } from "@/components/ItemsGrid";
import { ItemController } from "@/controllers/Item.controller";

export default async function ItemsPage() {
  const controller = new ItemController();
  const { data: items, error } = await controller.getItemsList();

  if (error) return <div>Error: {error}</div>;
  if (!items) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto p-4 text-black">
        <h1 className="text-2xl font-bold mb-6">Pokémon Items</h1>
        <ItemsGrid items={items} />
      </div>
    </main>
  );
}