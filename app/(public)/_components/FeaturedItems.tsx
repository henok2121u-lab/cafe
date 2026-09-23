"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { ItemDetailModal, type MenuItemView } from "./ItemDetailModal";

export function FeaturedItems({ items }: { items: MenuItemView[] }) {
  const [selectedItem, setSelectedItem] = useState<MenuItemView | null>(null);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedItem(item)}
            className="overflow-hidden rounded-2xl border border-cafe-border bg-cafe-surface text-left transition-shadow hover:shadow-md"
          >
            {item.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
              <img src={item.imageUrl} alt="" className="aspect-square w-full object-cover" />
            )}
            <div className="p-3 sm:p-4">
              <h3 className="text-base font-semibold text-foreground sm:text-lg">{item.name}</h3>
              {item.description && (
                <p className="mt-1 line-clamp-2 text-sm text-cafe-muted">{item.description}</p>
              )}
              <p className="mt-2 text-base font-bold text-cafe-accent sm:text-lg">{formatPrice(item.price)}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </>
  );
}
