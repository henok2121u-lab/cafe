"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage, deleteUploadedImage, UploadValidationError } from "@/lib/uploads";

const GALLERY_IMAGE_MAX_DIMENSION = 1600;

function revalidateGallery() {
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function createGalleryImageAction(formData: FormData) {
  await requireAdmin();
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    redirect(`/admin/gallery?error=${encodeURIComponent("Choose an image to upload.")}`);
  }

  let imageUrl: string;
  try {
    imageUrl = await saveUploadedImage(file, GALLERY_IMAGE_MAX_DIMENSION);
  } catch (error) {
    const message = error instanceof UploadValidationError ? error.message : "Could not process image.";
    redirect(`/admin/gallery?error=${encodeURIComponent(message)}`);
  }

  const last = await db.galleryImage.findFirst({ orderBy: { sortOrder: "desc" } });
  await db.galleryImage.create({
    data: { imageUrl, caption, sortOrder: (last?.sortOrder ?? -1) + 1 },
  });

  revalidateGallery();
}

export async function deleteGalleryImageAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const existing = await db.galleryImage.findUnique({ where: { id } });
  if (existing) {
    await deleteUploadedImage(existing.imageUrl);
    await db.galleryImage.delete({ where: { id } });
  }

  revalidateGallery();
}

export async function moveGalleryImageAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));

  const images = await db.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });
  const index = images.findIndex((image) => image.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= images.length) return;

  const current = images[index];
  const swapWith = images[swapIndex];

  await db.$transaction([
    db.galleryImage.update({ where: { id: current.id }, data: { sortOrder: swapWith.sortOrder } }),
    db.galleryImage.update({ where: { id: swapWith.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidateGallery();
}
