"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export function CartButton() {
  const { count } = useCart();

  if (count === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-cafe-primary text-cafe-primary-foreground shadow-lg transition-transform hover:scale-105"
      aria-label={`View cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.2a2 2 0 0 0 2-1.6L20 8H6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.4" fill="currentColor" />
        <circle cx="17" cy="20" r="1.4" fill="currentColor" />
      </svg>
      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-cafe-accent text-xs font-bold text-white">
        {count}
      </span>
    </Link>
  );
}
