"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../_components/CartContext";
import { ImagePlaceholder } from "../_components/ImagePlaceholder";
import { formatPrice } from "@/lib/format";
import { createOrder } from "@/lib/actions/orders";

export default function CartPage() {
  const { items, setQuantity, removeItem, clearCart, total } = useCart();
  const router = useRouter();

  const [orderType, setOrderType] = useState<"DINE_IN" | "PICKUP">("DINE_IN");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    setError(null);
    setSubmitting(true);
    const result = await createOrder({
      type: orderType,
      tableNumber: orderType === "DINE_IN" ? tableNumber : undefined,
      notes: notes || undefined,
      items: items.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    clearCart();
    router.push(`/order/${result.orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Your Order</h1>
        <p className="mt-4 text-cafe-muted">Your cart is empty.</p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-full bg-cafe-primary px-6 py-2.5 text-sm font-semibold text-cafe-primary-foreground hover:opacity-90"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-semibold text-foreground">Your Order</h1>

      <ul className="mt-6 divide-y divide-cafe-border rounded-2xl border border-cafe-border bg-cafe-surface">
        {items.map((item) => (
          <li key={item.menuItemId} className="flex items-center gap-3 p-4">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
              <img src={item.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-cafe-border/40 text-cafe-muted">
                <ImagePlaceholder className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{item.name}</p>
              <p className="text-sm text-cafe-muted">{formatPrice(item.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(item.menuItemId, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cafe-border text-foreground hover:border-cafe-primary"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-5 text-center font-medium text-foreground">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.menuItemId, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cafe-border text-foreground hover:border-cafe-primary"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.menuItemId)}
              aria-label={`Remove ${item.name}`}
              className="ml-1 text-cafe-muted hover:text-red-600"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between px-1 text-lg font-bold text-foreground">
        <span>Total</span>
        <span className="text-cafe-accent">{formatPrice(total)}</span>
      </div>

      <div className="mt-8 space-y-5 rounded-2xl border border-cafe-border bg-cafe-surface p-5">
        <div>
          <span className="block text-sm font-medium text-foreground">Order type</span>
          <div className="mt-2 flex gap-2">
            {(["DINE_IN", "PICKUP"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  orderType === type
                    ? "bg-cafe-primary text-cafe-primary-foreground"
                    : "border border-cafe-border text-foreground/80 hover:border-cafe-primary"
                }`}
              >
                {type === "DINE_IN" ? "Dine-in" : "Pickup"}
              </button>
            ))}
          </div>
        </div>

        {orderType === "DINE_IN" && (
          <div>
            <label htmlFor="tableNumber" className="block text-sm font-medium text-foreground">
              Table number
            </label>
            <input
              id="tableNumber"
              value={tableNumber}
              onChange={(event) => setTableNumber(event.target.value)}
              placeholder="e.g. 5"
              className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
            />
          </div>
        )}

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-foreground">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={2}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="e.g. no sugar, allergy info"
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={submitting || (orderType === "DINE_IN" && tableNumber.trim().length === 0)}
          className="w-full rounded-full bg-cafe-primary px-6 py-3 text-base font-semibold text-cafe-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Placing order…" : `Place Order — ${formatPrice(total)}`}
        </button>
        <p className="text-center text-xs text-cafe-muted">Pay at the counter when your order is ready.</p>
      </div>
    </div>
  );
}
