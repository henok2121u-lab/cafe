import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

function Icon({ path, className = "h-5 w-5" }: { path: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {path}
    </svg>
  );
}

const ICONS = {
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  orders: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  categories: (
    <path
      d="M11.5 3.5 20 12l-8.5 8.5-8-8V4h8Z M6.5 6.5h.01"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  menuItems: (
    <>
      <path d="M4 4h13v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V4Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M17 8h1.5a2.5 2.5 0 0 1 0 5H17" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  gallery: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 17 5-5 3.5 3.5L16 12l4 5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  qrCode: (
    <>
      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="14" width="3" height="3" fill="currentColor" />
      <rect x="18" y="18" width="3" height="3" fill="currentColor" />
      <rect x="14" y="18" width="3" height="3" fill="currentColor" />
      <rect x="18" y="14" width="3" height="3" fill="currentColor" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
};

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: ICONS.dashboard },
  { href: "/admin/orders", label: "Orders", icon: ICONS.orders },
  { href: "/admin/categories", label: "Categories", icon: ICONS.categories },
  { href: "/admin/menu-items", label: "Menu Items", icon: ICONS.menuItems },
  { href: "/admin/gallery", label: "Gallery", icon: ICONS.gallery },
  { href: "/admin/qr-code", label: "QR Code", icon: ICONS.qrCode },
  { href: "/admin/settings", label: "Settings", icon: ICONS.settings },
] as const;

function NavLinks({ className, linkClassName }: { className: string; linkClassName: string }) {
  return (
    <nav className={className}>
      {NAV_LINKS.map((link) => (
        <Link key={link.href} href={link.href} className={linkClassName}>
          <Icon path={link.icon} />
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function AdminDashboardLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-background sm:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-cafe-border bg-cafe-surface sm:flex">
        <div className="px-5 py-5">
          <span className="font-display text-lg font-semibold text-cafe-primary">Admin</span>
        </div>
        <NavLinks
          className="flex flex-1 flex-col gap-1 px-3"
          linkClassName="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-background hover:text-cafe-primary"
        />
        <div className="border-t border-cafe-border p-3">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cafe-muted hover:bg-background hover:text-cafe-primary"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="border-b border-cafe-border bg-cafe-surface sm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-display text-lg font-semibold text-cafe-primary">Admin</span>
          <form action={logoutAction}>
            <button type="submit" className="text-sm font-medium text-cafe-muted hover:text-cafe-primary">
              Log out
            </button>
          </form>
        </div>
        <NavLinks
          className="flex gap-1 overflow-x-auto px-3 pb-3"
          linkClassName="flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground/80 hover:text-cafe-primary"
        />
      </header>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
