import QRCode from "qrcode";
import { getSiteOrigin } from "@/lib/site-url";

// Reads the request's host header (via getSiteOrigin), so this can't be
// statically prerendered.
export const dynamic = "force-dynamic";

export default async function QrCodePage() {
  const origin = await getSiteOrigin();
  const menuUrl = `${origin}/menu`;

  const qrDataUrl = await QRCode.toDataURL(menuUrl, {
    width: 640,
    margin: 2,
    color: { dark: "#2a1d15", light: "#ffffff" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">QR Code</h1>
      <p className="mt-2 max-w-lg text-sm text-cafe-muted">
        Print this and put it on tables, or add it to a sign at the counter. Scanning it opens your
        menu directly — no typing required.
      </p>

      <div className="mt-6 inline-block rounded-2xl border border-cafe-border bg-cafe-surface p-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- a generated data URL, not a static or uploaded asset */}
        <img src={qrDataUrl} alt={`QR code linking to ${menuUrl}`} className="h-56 w-56 sm:h-64 sm:w-64" />
      </div>

      <p className="mt-4 max-w-lg break-all text-sm text-cafe-muted">Links to: {menuUrl}</p>

      <a
        href={qrDataUrl}
        download="menu-qr-code.png"
        className="mt-4 inline-block rounded-md bg-cafe-primary px-4 py-2 text-sm font-semibold text-cafe-primary-foreground hover:opacity-90"
      >
        Download PNG
      </a>
    </div>
  );
}
