"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { orderEvents, ORDER_EVENT } from "@/lib/order-events";
import type { OrderStatus } from "@prisma/client";

const createOrderSchema = z
  .object({
    type: z.enum(["DINE_IN", "PICKUP"]),
    tableNumber: z.string().trim().max(50).optional(),
    notes: z.string().trim().max(500).optional(),
    items: z
      .array(
        z.object({
          menuItemId: z.string().min(1),
          quantity: z.number().int().min(1).max(50),
        })
      )
      .min(1, "Cart is empty"),
  })
  .refine((data) => data.type !== "DINE_IN" || (data.tableNumber && data.tableNumber.length > 0), {
    message: "Table number is required for dine-in orders",
    path: ["tableNumber"],
  });

export async function createOrder(input: z.infer<typeof createOrderSchema>) {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }
  const { type, tableNumber, notes, items } = parsed.data;

  // Never trust client-submitted prices — look up the real, current price
  // and name for each item server-side, and snapshot it onto the order line.
  const menuItems = await db.menuItem.findMany({
    where: { id: { in: items.map((item) => item.menuItemId) } },
  });
  const menuItemById = new Map(menuItems.map((item) => [item.id, item]));

  const missingOrUnavailable = items.find((item) => {
    const menuItem = menuItemById.get(item.menuItemId);
    return !menuItem || !menuItem.isAvailable;
  });
  if (missingOrUnavailable) {
    return { success: false as const, error: "One of the items in your cart is no longer available." };
  }

  const orderItemsData = items.map((item) => {
    const menuItem = menuItemById.get(item.menuItemId)!;
    return {
      menuItemId: menuItem.id,
      nameSnapshot: menuItem.name,
      priceSnapshot: menuItem.price,
      quantity: item.quantity,
    };
  });
  const total = orderItemsData.reduce(
    (sum, item) => sum + Number(item.priceSnapshot) * item.quantity,
    0
  );

  const order = await db.order.create({
    data: {
      type,
      tableNumber: type === "DINE_IN" ? tableNumber : null,
      notes: notes || null,
      total,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  orderEvents.emit(ORDER_EVENT, { type: "new-order", orderId: order.id });

  return { success: true as const, orderId: order.id, orderNumber: order.orderNumber };
}

export async function getOrderStatus(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { orderNumber: true, status: true, type: true, tableNumber: true },
  });
  return order;
}

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  PENDING: "PREPARING",
  PREPARING: "READY",
  READY: "COMPLETED",
  COMPLETED: null,
  CANCELLED: null,
};

export async function advanceOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId"));
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const next = NEXT_STATUS[order.status];
  if (!next) return;

  await db.order.update({ where: { id: orderId }, data: { status: next } });
  orderEvents.emit(ORDER_EVENT, { type: "status-change", orderId });
}

export async function cancelOrderAction(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId"));
  await db.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
  orderEvents.emit(ORDER_EVENT, { type: "status-change", orderId });
}
