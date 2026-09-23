"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Invisible: opens the SSE connection to /api/orders/stream and refreshes
 * the (server-rendered) order list whenever something changes, so staff
 * never have to manually reload. Also shows a brief banner on new orders.
 */
export function LiveOrdersRefresher() {
  const router = useRouter();
  const [banner, setBanner] = useState(false);
  const bannerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/orders/stream");

    source.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "connected") return;

      router.refresh();

      if (payload.type === "new-order") {
        setBanner(true);
        if (bannerTimeout.current) clearTimeout(bannerTimeout.current);
        bannerTimeout.current = setTimeout(() => setBanner(false), 4000);
      }
    };

    return () => {
      source.close();
      if (bannerTimeout.current) clearTimeout(bannerTimeout.current);
    };
  }, [router]);

  if (!banner) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-cafe-primary px-5 py-2.5 text-sm font-semibold text-cafe-primary-foreground shadow-lg">
      New order received
    </div>
  );
}
