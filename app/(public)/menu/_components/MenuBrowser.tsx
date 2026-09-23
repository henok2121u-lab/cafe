"use client";

import { useState } from "react";
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

export function MenuBrowser({ categories }: { categories: MenuCategoryView[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
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
          <article
            key={item.id}
            className={`overflow-hidden rounded-2xl border border-cafe-border bg-cafe-surface transition-shadow hover:shadow-md ${
              item.isAvailable ? "" : "opacity-60"
            }`}
          >
            <div className="relative aspect-square w-full bg-cafe-border/40">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-cafe-muted">
                  <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 opacity-40" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="m4 17 5-5 3.5 3.5L16 12l4 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
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
          </article>
        ))}

        {active.items.length === 0 && (
          <p className="col-span-full text-sm text-cafe-muted">No items in this category yet.</p>
        )}
      </div>
    </div>
  );
}
