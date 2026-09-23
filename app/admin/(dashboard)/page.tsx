import Link from "next/link";
import { db } from "@/lib/db";

// Always reflect live counts — this route reads no cookies/searchParams, so
// without this it would otherwise be eligible for static prerendering.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [categoryCount, itemCount, unavailableCount, galleryCount] = await Promise.all([
    db.category.count(),
    db.menuItem.count(),
    db.menuItem.count({ where: { isAvailable: false } }),
    db.galleryImage.count(),
  ]);

  const stats = [
    { label: "Categories", value: categoryCount, href: "/admin/categories" },
    { label: "Menu Items", value: itemCount, href: "/admin/menu-items" },
    { label: "Unavailable Items", value: unavailableCount, href: "/admin/menu-items" },
    { label: "Gallery Photos", value: galleryCount, href: "/admin/gallery" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-cafe-border bg-cafe-surface p-5 transition-colors hover:border-cafe-primary"
          >
            <p className="text-sm text-cafe-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
