import type { Metadata } from "next";
import { getMenu } from "@/lib/data/menu";
import { MenuBrowser } from "./_components/MenuBrowser";

export const metadata: Metadata = {
  title: "Menu",
};

// See app/(public)/page.tsx for why this is force-dynamic rather than ISR.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const categories = await getMenu();

  const categoryViews = categories.map((category) => ({
    id: category.id,
    name: category.name,
    items: category.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
    })),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Menu</h1>

      {categoryViews.length === 0 ? (
        <p className="mt-6 text-cafe-muted">The menu is being set up — check back soon.</p>
      ) : (
        <div className="mt-6 sm:mt-8">
          <MenuBrowser categories={categoryViews} />
        </div>
      )}
    </div>
  );
}
