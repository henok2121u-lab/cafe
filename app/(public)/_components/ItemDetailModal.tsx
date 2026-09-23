"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { useCart } from "./CartContext";

export type MenuItemView = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
};

export function ItemDetailModal({ item, onClose }: { item: MenuItemView; onClose: () => void }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-detail-name"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-cafe-surface sm:rounded-2xl"
      >
        <div className="relative aspect-square w-full bg-cafe-border/40">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
            <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-cafe-muted">
              <ImagePlaceholder className="h-16 w-16" />
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
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
              {item.name}
            </h3>
            <p className="whitespace-nowrap text-xl font-bold text-cafe-accent">{formatPrice(item.price)}</p>
          </div>
          {!item.isAvailable && (
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-cafe-muted">
              Currently unavailable
            </p>
          )}
          {item.description && <p className="mt-4 text-base text-cafe-muted">{item.description}</p>}

          {item.isAvailable && (
            <button
              type="button"
              onClick={() => {
                addItem({ menuItemId: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl });
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              className="mt-5 w-full rounded-full bg-cafe-primary px-6 py-3 text-base font-semibold text-cafe-primary-foreground transition-opacity hover:opacity-90"
            >
              {added ? "Added ✓" : "Add to Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
