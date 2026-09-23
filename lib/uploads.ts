import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function uploadDir() {
  return process.env.UPLOAD_DIR ?? "./uploads";
}

export class UploadValidationError extends Error {}

/**
 * Resizes and re-encodes to webp under a random filename, then writes it to
 * UPLOAD_DIR (a Dokploy-mounted volume in production). Returns the public
 * path to store on the record, served by app/uploads/[...path]/route.ts.
 */
export async function saveUploadedImage(file: File, maxDimension: number) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadValidationError("Only JPEG, PNG, or WEBP images are allowed.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new UploadValidationError("Image must be 5MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}.webp`;
  const dir = uploadDir();
  await mkdir(dir, { recursive: true });

  await sharp(buffer)
    .resize({ width: maxDimension, height: maxDimension, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(dir, filename));

  return `/uploads/${filename}`;
}

/** Best-effort: a missing file should never block deleting the DB record. */
export async function deleteUploadedImage(imageUrl: string | null) {
  if (!imageUrl?.startsWith("/uploads/")) return;
  const filename = imageUrl.slice("/uploads/".length);
  if (filename.includes("/") || filename.includes("..")) return;

  try {
    await unlink(path.join(/* turbopackIgnore: true */ uploadDir(), filename));
  } catch {
    // File already gone or never existed — nothing to clean up.
  }
}
