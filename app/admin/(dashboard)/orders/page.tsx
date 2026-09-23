import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { advanceOrderStatusAction, cancelOrderAction } from "@/lib/actions/orders";
import { LiveOrdersRefresher } from "./_components/LiveOrdersRefresher";
import type { OrderStatus } from "@prisma/client";

// Reads live order data on every request — the whole point of this page.
export const dynamic = "force-dynamic";

const COLUMNS: { status: OrderStatus; title: string; actionLabel: string }[] = [
  { status: "PENDING", title: "New", actionLabel: "Start Preparing" },
  { status: "PREPARING", title: "Preparing", actionLabel: "Mark Ready" },
  { status: "READY", title: "Ready", actionLabel: "Complete" },
];

function timeAgo(date: Date) {
  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} hr ago`;
}

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    where: { status: { in: ["PENDING", "PREPARING", "READY"] } },
    include: { items: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <LiveOrdersRefresher />
      <h1 className="text-2xl font-semibold text-foreground">Orders</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnOrders = orders.filter((order) => order.status === column.status);
          return (
            <div key={column.status}>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cafe-muted">
                {column.title}
                <span className="rounded-full bg-cafe-border px-2 py-0.5 text-xs text-foreground">
                  {columnOrders.length}
                </span>
              </h2>

              <div className="mt-3 space-y-3">
                {columnOrders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-cafe-border bg-cafe-surface p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          #{order.orderNumber} · {order.type === "DINE_IN" ? `Table ${order.tableNumber}` : "Pickup"}
                        </p>
                        <p className="text-xs text-cafe-muted">{timeAgo(order.createdAt)}</p>
                      </div>
                      <p className="font-semibold text-cafe-accent">{formatPrice(order.total)}</p>
                    </div>

                    <ul className="mt-2 space-y-0.5 text-sm text-foreground">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.quantity}× {item.nameSnapshot}
                        </li>
                      ))}
                    </ul>

                    {order.notes && <p className="mt-2 text-sm italic text-cafe-muted">"{order.notes}"</p>}

                    <div className="mt-3 flex gap-2">
                      <form action={advanceOrderStatusAction} className="flex-1">
                        <input type="hidden" name="orderId" value={order.id} />
                        <button
                          type="submit"
                          className="w-full rounded-md bg-cafe-primary px-3 py-1.5 text-sm font-semibold text-cafe-primary-foreground hover:opacity-90"
                        >
                          {column.actionLabel}
                        </button>
                      </form>
                      <form action={cancelOrderAction}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-cafe-border px-3 py-1.5 text-sm text-cafe-muted hover:border-red-400 hover:text-red-600"
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  </div>
                ))}

                {columnOrders.length === 0 && <p className="text-sm text-cafe-muted">No orders</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
