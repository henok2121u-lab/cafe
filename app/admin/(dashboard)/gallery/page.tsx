import { db } from "@/lib/db";
import {
  createGalleryImageAction,
  deleteGalleryImageAction,
  moveGalleryImageAction,
} from "@/lib/actions/gallery";

export default async function AdminGalleryPage(props: PageProps<"/admin/gallery">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;
  const images = await db.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Gallery</h1>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form action={createGalleryImageAction} className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-foreground">
            Photo
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="mt-1 block text-sm"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="caption" className="block text-sm font-medium text-foreground">
            Caption (optional)
          </label>
          <input
            id="caption"
            name="caption"
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-cafe-primary px-4 py-2 text-sm font-semibold text-cafe-primary-foreground hover:opacity-90"
        >
          Upload
        </button>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <div key={image.id} className="overflow-hidden rounded-lg border border-cafe-border bg-cafe-surface">
            {/* eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset */}
            <img src={image.imageUrl} alt="" className="aspect-square w-full object-cover" />
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex gap-1">
                <form action={moveGalleryImageAction}>
                  <input type="hidden" name="id" value={image.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={index === 0}
                    className="text-cafe-muted hover:text-cafe-primary disabled:opacity-20"
                    aria-label="Move earlier"
                  >
                    ◀
                  </button>
                </form>
                <form action={moveGalleryImageAction}>
                  <input type="hidden" name="id" value={image.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={index === images.length - 1}
                    className="text-cafe-muted hover:text-cafe-primary disabled:opacity-20"
                    aria-label="Move later"
                  >
                    ▶
                  </button>
                </form>
              </div>
              <form action={deleteGalleryImageAction}>
                <input type="hidden" name="id" value={image.id} />
                <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-800">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}

        {images.length === 0 && <p className="text-sm text-cafe-muted">No photos yet.</p>}
      </div>
    </div>
  );
}
