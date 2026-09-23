"use client";

import { useEffect, useState } from "react";
import { getOrderStatus } from "@/lib/actions/orders";
import type { OrderStatus, OrderType } from "@prisma/client";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Received" },
  { status: "PREPARING", label: "Preparing" },
  { status: "READY", label: "Ready" },
  { status: "COMPLETED", label: "Completed" },
];

export function OrderStatusView({
  orderId,
  initialStatus,
  orderNumber,
  type,
  tableNumber,
}: {
  orderId: string;
  initialStatus: OrderStatus;
  orderNumber: number;
  type: OrderType;
  tableNumber: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (status === "COMPLETED" || status === "CANCELLED") return;

    const interval = setInterval(async () => {
      const order = await getOrderStatus(orderId);
      if (order) setStatus(order.status);
    }, 4000);

    return () => clearInterval(interval);
  }, [orderId, status]);

  const stepIndex = STEPS.findIndex((step) => step.status === status);

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-cafe-muted">
        {type === "DINE_IN" ? `Table ${tableNumber}` : "Pickup"}
      </p>
      <h1 className="font-display text-3xl font-semibold text-foreground">Order #{orderNumber}</h1>

      {status === "CANCELLED" ? (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-red-700">
          This order was cancelled. Please check with a staff member.
        </p>
      ) : (
        <div className="mt-8 flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.status} className="flex flex-1 flex-col items-center last:flex-none">
              <div className="flex w-full items-center">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    index <= stepIndex
                      ? "bg-cafe-primary text-cafe-primary-foreground"
                      : "border border-cafe-border text-cafe-muted"
                  }`}
                >
                  {index < stepIndex ? "✓" : index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 ${index < stepIndex ? "bg-cafe-primary" : "bg-cafe-border"}`} />
                )}
              </div>
              <span
                className={`mt-2 text-center text-xs font-medium ${
                  index <= stepIndex ? "text-foreground" : "text-cafe-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
