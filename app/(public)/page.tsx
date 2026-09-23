import Link from "next/link";
import { getCafeSettings } from "@/lib/data/settings";
import { getMenu } from "@/lib/data/menu";
import { FeaturedItems } from "./_components/FeaturedItems";

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
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
    }));

  return (
    <div>
      <section className="relative overflow-hidden bg-cafe-primary text-cafe-primary-foreground">
        <div className="bg-dot-pattern absolute inset-0 text-cafe-primary-foreground/30" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
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
          <FeaturedItems items={featuredItems} />
        </section>
      )}
    </div>
  );
}
