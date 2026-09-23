import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getGalleryImages = cache(async function getGalleryImages() {
  return db.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
});
