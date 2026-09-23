import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/menu-items", label: "Menu Items" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export default function AdminDashboardLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-cafe-border bg-cafe-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <nav className="flex flex-wrap gap-5 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground/80 hover:text-cafe-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction}>
            <button type="submit" className="text-sm font-medium text-cafe-muted hover:text-cafe-primary">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
