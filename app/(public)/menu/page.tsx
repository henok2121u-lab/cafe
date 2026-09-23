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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Menu</h1>

      {categories.length === 0 && (
        <p className="mt-6 text-cafe-muted">The menu is being set up — check back soon.</p>
      )}

      {categories.length > 1 && (
        <nav
          aria-label="Jump to category"
          className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#cat-${category.id}`}
              className="shrink-0 whitespace-nowrap rounded-full border border-cafe-border px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-cafe-primary hover:text-cafe-primary"
            >
              {category.name}
            </a>
          ))}
        </nav>
      )}

      <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
        {categories.map((category) => (
          <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-20">
            <h2 className="border-b border-cafe-border pb-2 text-lg font-semibold text-cafe-primary sm:text-xl">
              {category.name}
            </h2>
            <ul className="mt-4 space-y-5">
              {category.items.map((item) => (
                <li key={item.id} className={`flex gap-3 sm:gap-4 ${item.isAvailable ? "" : "opacity-50"}`}>
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-medium text-foreground">
                        {item.name}
                        {!item.isAvailable && (
                          <span className="ml-2 block text-xs font-normal uppercase tracking-wide text-cafe-muted sm:inline">
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
