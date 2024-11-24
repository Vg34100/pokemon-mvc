// src/components/ItemsGrid.tsx
import Image from 'next/image';
import { Item } from "@/models/Item.model";

export function ItemsGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="relative w-12 h-12">
              <Image
                src={item.sprite}
                alt={item.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold capitalize">
                {item.name.replace("-", " ")}
              </h2>
              <span className="text-sm text-gray-600 capitalize">
                {item.category}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{item.effect}</p>
          <div className="text-sm text-gray-700">
            Cost: ₽{item.cost.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}