"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function revalidatePublicMenu() {
  revalidatePath("/");
  revalidatePath("/menu");
}

function redirectWithError(message: string): never {
  redirect(`/admin/categories?error=${encodeURIComponent(message)}`);
}

const nameSchema = z.string().trim().min(1, "Name is required").max(100);

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0].message);
  }

  const last = await db.category.findFirst({ orderBy: { sortOrder: "desc" } });
  await db.category.create({
    data: { name: parsed.data, sortOrder: (last?.sortOrder ?? -1) + 1 },
  });

  revalidatePath("/admin/categories");
  revalidatePublicMenu();
}

export async function renameCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0].message);
  }

  await db.category.update({ where: { id }, data: { name: parsed.data } });

  revalidatePath("/admin/categories");
  revalidatePublicMenu();
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const category = await db.category.findUnique({
    where: { id },
    include: { _count: { select: { items: true } } },
  });
  if (!category) return;

  if (category._count.items > 0) {
    redirectWithError(
      `Can't delete "${category.name}" — move or delete its ${category._count.items} menu item(s) first.`
    );
  }

  await db.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  revalidatePublicMenu();
}

export async function moveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));

  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  const index = categories.findIndex((c) => c.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || swapIndex < 0 || swapIndex >= categories.length) {
    return;
  }

  const current = categories[index];
  const swapWith = categories[swapIndex];

  await db.$transaction([
    db.category.update({ where: { id: current.id }, data: { sortOrder: swapWith.sortOrder } }),
    db.category.update({ where: { id: swapWith.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/categories");
  revalidatePublicMenu();
}
