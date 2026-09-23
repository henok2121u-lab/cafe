import type { Metadata } from "next";
import { getMenu } from "@/lib/data/menu";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Menu",
};

// See app/(public)/page.tsx for why this is force-dynamic rather than ISR.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const categories = await getMenu();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-foreground">Menu</h1>

      {categories.length === 0 && (
        <p className="mt-6 text-cafe-muted">The menu is being set up — check back soon.</p>
      )}

      <div className="mt-10 space-y-12">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="border-b border-cafe-border pb-2 text-xl font-semibold text-cafe-primary">
              {category.name}
            </h2>
            <ul className="mt-4 space-y-5">
              {category.items.map((item) => (
                <li key={item.id} className={`flex gap-4 ${item.isAvailable ? "" : "opacity-50"}`}>
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-medium text-foreground">
                        {item.name}
                        {!item.isAvailable && (
                          <span className="ml-2 text-xs font-normal uppercase tracking-wide text-cafe-muted">
                            Currently unavailable
                          </span>
                        )}
                      </h3>
                      <span className="whitespace-nowrap font-semibold text-cafe-accent">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-cafe-muted">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
