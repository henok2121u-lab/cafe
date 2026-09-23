import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { deleteMenuItemAction, moveMenuItemAction } from "@/lib/actions/menu-items";

// Always reflect live data — this route reads no cookies/searchParams, so
// without this it would otherwise be eligible for static prerendering.
export const dynamic = "force-dynamic";

export default async function AdminMenuItemsPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Menu Items</h1>
        <Link
          href="/admin/menu-items/new"
          className="rounded-md bg-cafe-primary px-4 py-2 text-sm font-semibold text-cafe-primary-foreground hover:opacity-90"
        >
          Add Item
        </Link>
      </div>

      {categories.length === 0 && (
        <p className="mt-6 text-sm text-cafe-muted">
          Add a <Link href="/admin/categories" className="underline">category</Link> first, then items.
        </p>
      )}

      <div className="mt-8 space-y-10">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="text-lg font-semibold text-cafe-primary">{category.name}</h2>
            <ul className="mt-3 divide-y divide-cafe-border rounded-xl border border-cafe-border bg-cafe-surface">
              {category.items.map((item, index) => (
                <li key={item.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="flex flex-col">
                    <form action={moveMenuItemAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={index === 0}
                        className="block text-cafe-muted hover:text-cafe-primary disabled:opacity-20"
                        aria-label="Move up"
                      >
                        ▲
                      </button>
                    </form>
                    <form action={moveMenuItemAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={index === category.items.length - 1}
                        className="block text-cafe-muted hover:text-cafe-primary disabled:opacity-20"
                        aria-label="Move down"
                      >
                        ▼
                      </button>
                    </form>
                  </div>

                  {/* eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset */}
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-cafe-border" />
                  )}

                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {item.name}
                      {!item.isAvailable && (
                        <span className="ml-2 text-xs font-normal uppercase text-cafe-muted">Unavailable</span>
                      )}
                    </p>
                    <p className="text-sm text-cafe-muted">{formatPrice(item.price)}</p>
                  </div>

                  <Link
                    href={`/admin/menu-items/${item.id}`}
                    className="text-sm font-medium text-cafe-primary hover:underline"
                  >
                    Edit
                  </Link>

                  <form action={deleteMenuItemAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </form>
                </li>
              ))}

              {category.items.length === 0 && (
                <li className="px-4 py-4 text-sm text-cafe-muted">No items in this category yet.</li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
