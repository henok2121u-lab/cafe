import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
};

// See app/(public)/page.tsx for why this is force-dynamic rather than ISR.
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-foreground">Gallery</h1>

      {images.length === 0 ? (
        <p className="mt-6 text-cafe-muted">Photos are coming soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <figure key={image.id} className="overflow-hidden rounded-lg border border-cafe-border bg-cafe-surface">
              {/* eslint-disable-next-line @next/next/no-img-element -- images are served at runtime from a mounted volume, outside next/image's static optimizer */}
              <img
                src={image.imageUrl}
                alt={image.caption ?? ""}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              {image.caption && (
                <figcaption className="px-3 py-2 text-sm text-cafe-muted">{image.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
