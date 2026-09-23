import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { OrderStatusView } from "./_components/OrderStatusView";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage(props: PageProps<"/order/[id]">) {
  const { id } = await props.params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <OrderStatusView
        orderId={order.id}
        initialStatus={order.status}
        orderNumber={order.orderNumber}
        type={order.type}
        tableNumber={order.tableNumber}
      />

      <ul className="mt-8 divide-y divide-cafe-border rounded-2xl border border-cafe-border bg-cafe-surface">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 p-4">
            <span className="text-foreground">
              {item.quantity}× {item.nameSnapshot}
            </span>
            <span className="whitespace-nowrap text-cafe-muted">
              {formatPrice(Number(item.priceSnapshot) * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between px-1 text-lg font-bold text-foreground">
        <span>Total</span>
        <span className="text-cafe-accent">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}
