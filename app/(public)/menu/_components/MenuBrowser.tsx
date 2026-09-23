"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { ImagePlaceholder } from "../../_components/ImagePlaceholder";
import { ItemDetailModal, type MenuItemView } from "../../_components/ItemDetailModal";

type MenuCategoryView = {
  id: string;
  name: string;
  items: MenuItemView[];
};

export function MenuBrowser({ categories }: { categories: MenuCategoryView[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const [selectedItem, setSelectedItem] = useState<MenuItemView | null>(null);
  const active = categories.find((category) => category.id === activeId) ?? categories[0];

  if (!active) return null;

  return (
    <div>
      {categories.length > 1 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {categories.map((category) => {
            const isActive = category.id === active.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveId(category.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-base font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-cafe-primary text-cafe-primary-foreground"
                    : "border border-cafe-border text-foreground/80 hover:border-cafe-primary hover:text-cafe-primary"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-3">
        {active.items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedItem(item)}
            className={`overflow-hidden rounded-2xl border border-cafe-border bg-cafe-surface text-left transition-shadow hover:shadow-md ${
              item.isAvailable ? "" : "opacity-60"
            }`}
          >
            <div className="relative aspect-square w-full bg-cafe-border/40">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-cafe-muted">
                  <ImagePlaceholder />
                </div>
              )}
              {!item.isAvailable && (
                <span className="absolute left-2 top-2 rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-background">
                  Unavailable
                </span>
              )}
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="text-base font-semibold text-foreground sm:text-lg">{item.name}</h3>
              {item.description && (
                <p className="mt-1 line-clamp-2 text-sm text-cafe-muted">{item.description}</p>
              )}
              <p className="mt-2 text-base font-bold text-cafe-accent sm:text-lg">{formatPrice(item.price)}</p>
            </div>
          </button>
        ))}

        {active.items.length === 0 && (
          <p className="col-span-full text-sm text-cafe-muted">No items in this category yet.</p>
        )}
      </div>

      {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
