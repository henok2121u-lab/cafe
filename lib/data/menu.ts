import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getMenu = cache(async function getMenu() {
  return db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
});
