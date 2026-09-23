import Link from "next/link";
import { getCafeSettings } from "@/lib/data/settings";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/location", label: "Location" },
] as const;

// See app/(public)/page.tsx for why this is force-dynamic rather than ISR.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const settings = await getCafeSettings();

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-cafe-border bg-cafe-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-cafe-primary">
            {settings.name}
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 transition-colors hover:text-cafe-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-cafe-border bg-cafe-surface">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-cafe-muted">
          <p className="font-medium text-foreground">{settings.name}</p>
          {settings.address && <p className="mt-1">{settings.address}</p>}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {settings.phone && <a href={`tel:${settings.phone}`} className="hover:text-cafe-primary">{settings.phone}</a>}
            {settings.email && <a href={`mailto:${settings.email}`} className="hover:text-cafe-primary">{settings.email}</a>}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} className="hover:text-cafe-primary" target="_blank" rel="noreferrer">
                Facebook
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} className="hover:text-cafe-primary" target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
