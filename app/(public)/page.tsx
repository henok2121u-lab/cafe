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
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{settings.name}</h1>
          <p className="mx-auto mt-4 max-w-xl text-cafe-primary-foreground/85">
            Fresh coffee, house-made pastries, and a warm place to sit for a while.
          </p>
          <div className="mt-8 flex justify-center gap-4">
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
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-foreground">A few favorites</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {featuredItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-cafe-border bg-cafe-surface p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <span className="text-sm font-semibold text-cafe-accent">{formatPrice(item.price)}</span>
                </div>
                {item.description && (
                  <p className="mt-2 text-sm text-cafe-muted">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
