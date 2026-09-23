import type { Prisma } from "@prisma/client";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "ETB",
});

export function formatPrice(price: Prisma.Decimal | number | string) {
  return currencyFormatter.format(Number(price));
}
