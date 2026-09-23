"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage, deleteUploadedImage, UploadValidationError } from "@/lib/uploads";

const MENU_ITEM_IMAGE_MAX_DIMENSION = 800;

function revalidatePublicMenu() {
  revalidatePath("/");
  revalidatePath("/menu");
}

const menuItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  description: z.string().trim().max(500).optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  categoryId: z.string().trim().min(1, "Category is required"),
  isAvailable: z.literal("on").optional(),
});

function parseForm(formData: FormData) {
  return menuItemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    isAvailable: formData.get("isAvailable") ?? undefined,
  });
}

async function processImage(formData: FormData) {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return undefined;
  return saveUploadedImage(file, MENU_ITEM_IMAGE_MAX_DIMENSION);
}

export async function createMenuItemAction(formData: FormData) {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect(`/admin/menu-items/new?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  let imageUrl: string | undefined;
  try {
    imageUrl = await processImage(formData);
  } catch (error) {
    const message = error instanceof UploadValidationError ? error.message : "Could not process image.";
    redirect(`/admin/menu-items/new?error=${encodeURIComponent(message)}`);
  }

  const last = await db.menuItem.findFirst({
    where: { categoryId: parsed.data.categoryId },
    orderBy: { sortOrder: "desc" },
  });

  await db.menuItem.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      price: parsed.data.price,
      categoryId: parsed.data.categoryId,
      isAvailable: parsed.data.isAvailable === "on",
      imageUrl: imageUrl ?? null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/admin/menu-items");
  revalidatePublicMenu();
  redirect("/admin/menu-items");
}

export async function updateMenuItemAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect(`/admin/menu-items/${id}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const existing = await db.menuItem.findUnique({ where: { id } });
  if (!existing) redirect("/admin/menu-items");

  let imageUrl = existing.imageUrl;
  try {
    const newImageUrl = await processImage(formData);
    if (newImageUrl) {
      await deleteUploadedImage(existing.imageUrl);
      imageUrl = newImageUrl;
    }
  } catch (error) {
    const message = error instanceof UploadValidationError ? error.message : "Could not process image.";
    redirect(`/admin/menu-items/${id}?error=${encodeURIComponent(message)}`);
  }

  await db.menuItem.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      price: parsed.data.price,
      categoryId: parsed.data.categoryId,
      isAvailable: parsed.data.isAvailable === "on",
      imageUrl,
    },
  });

  revalidatePath("/admin/menu-items");
  revalidatePublicMenu();
  redirect("/admin/menu-items");
}

export async function deleteMenuItemAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const existing = await db.menuItem.findUnique({ where: { id } });
  if (existing) {
    await deleteUploadedImage(existing.imageUrl);
    await db.menuItem.delete({ where: { id } });
  }

  revalidatePath("/admin/menu-items");
  revalidatePublicMenu();
}

export async function moveMenuItemAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));

  const current = await db.menuItem.findUnique({ where: { id } });
  if (!current) return;

  const siblings = await db.menuItem.findMany({
    where: { categoryId: current.categoryId },
    orderBy: { sortOrder: "asc" },
  });
  const index = siblings.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) return;

  const swapWith = siblings[swapIndex];
  await db.$transaction([
    db.menuItem.update({ where: { id: current.id }, data: { sortOrder: swapWith.sortOrder } }),
    db.menuItem.update({ where: { id: swapWith.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/menu-items");
  revalidatePublicMenu();
}
