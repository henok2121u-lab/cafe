import Link from "next/link";
import { getCafeSettings } from "@/lib/data/settings";
import { getMenu } from "@/lib/data/menu";
import { formatPrice } from "@/lib/format";

// Render per-request rather than statically: static generation would need a
// live database connection at `next build` time (e.g. in the Docker build
// stage, before the runtime DB is reachable), and traffic here is low enough
// that a fresh DB read per request costs nothing noticeable.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, categories] = await Promise.all([getCafeSettings(), getMenu()]);
  const featuredItems = categories
    .flatMap((category) => category.items)
    .filter((item) => item.isAvailable)
    .slice(0, 3);

  return (
    <div>
      <section className="bg-cafe-primary text-cafe-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            {settings.name}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cafe-primary-foreground/85">
            Fresh coffee, house-made pastries, and a warm place to sit for a while.
          </p>
          <div className="mt-8 flex justify-center gap-3 sm:gap-4">
            <Link
              href="/menu"
              className="rounded-full bg-cafe-primary-foreground px-6 py-2.5 text-sm font-semibold text-cafe-primary transition-opacity hover:opacity-90"
            >
              View Menu
            </Link>
            <Link
              href="/location"
              className="rounded-full border border-cafe-primary-foreground/40 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-cafe-primary-foreground/10"
            >
              Visit Us
            </Link>
          </div>
        </div>
      </section>

      {featuredItems.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            A few favorites
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-cafe-border bg-cafe-surface transition-shadow hover:shadow-md"
              >
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- runtime-served upload, not a build-time static asset
                  <img src={item.imageUrl} alt="" className="aspect-square w-full object-cover" />
                )}
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  {item.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-cafe-muted sm:text-sm">
                      {item.description}
                    </p>
                  )}
                  <p className="mt-2 font-semibold text-cafe-accent">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
