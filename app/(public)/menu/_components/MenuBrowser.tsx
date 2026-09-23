"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";

type MenuItemView = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
};

type MenuCategoryView = {
  id: string;
  name: string;
  items: MenuItemView[];
};

function ImagePlaceholder({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${className} opacity-40`} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 17 5-5 3.5 3.5L16 12l4 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuBrowser({ categories }: { categories: MenuCategoryView[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const [selectedItem, setSelectedItem] = useState<MenuItemView | null>(null);
  const active = categories.find((category) => category.id === activeId) ?? categories[0];

  useEffect(() => {
    if (!selectedItem) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedItem(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedItem]);

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

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 sm:items-center sm:p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-detail-name"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-cafe-surface sm:rounded-2xl"
          >
            <div className="relative aspect-square w-full bg-cafe-border/40">
              {selectedItem.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
                <img src={selectedItem.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-cafe-muted">
                  <ImagePlaceholder className="h-16 w-16" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cafe-surface text-foreground shadow-md hover:opacity-80"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 id="item-detail-name" className="font-display text-2xl font-semibold text-foreground">
                  {selectedItem.name}
                </h3>
                <p className="whitespace-nowrap text-xl font-bold text-cafe-accent">
                  {formatPrice(selectedItem.price)}
                </p>
              </div>
              {!selectedItem.isAvailable && (
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-cafe-muted">
                  Currently unavailable
                </p>
              )}
              {selectedItem.description && (
                <p className="mt-4 text-base text-cafe-muted">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
