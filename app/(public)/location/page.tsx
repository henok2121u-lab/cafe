import type { Metadata } from "next";
import { getCafeSettings, DAY_ORDER, dayLabel, type OpeningHours } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Location",
};

// See app/(public)/page.tsx for why this is force-dynamic rather than ISR.
export const dynamic = "force-dynamic";

export default async function LocationPage() {
  const settings = await getCafeSettings();
  const hours = (settings.openingHours ?? null) as OpeningHours | null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Visit Us</h1>

      <div className="mt-8 grid gap-8 sm:mt-10 sm:grid-cols-2 sm:gap-10">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cafe-muted">Contact</h2>
          <dl className="mt-3 space-y-2 text-foreground">
            {settings.address && <dd>{settings.address}</dd>}
            {settings.phone && (
              <dd>
                <a href={`tel:${settings.phone}`} className="hover:text-cafe-primary">
                  {settings.phone}
                </a>
              </dd>
            )}
            {settings.email && (
              <dd>
                <a href={`mailto:${settings.email}`} className="hover:text-cafe-primary">
                  {settings.email}
                </a>
              </dd>
            )}
          </dl>
        </div>

        {hours && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cafe-muted">Opening Hours</h2>
            <dl className="mt-3 space-y-1 text-sm">
              {DAY_ORDER.filter((day) => hours[day]).map((day) => (
                <div key={day} className="flex justify-between gap-4 text-foreground">
                  <dt className="text-cafe-muted">{dayLabel(day)}</dt>
                  <dd>{hours[day]}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {settings.mapEmbedUrl && (
        <div className="mt-10 overflow-hidden rounded-xl border border-cafe-border">
          <iframe
            src={settings.mapEmbedUrl}
            className="h-80 w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map"
          />
        </div>
      )}
    </div>
  );
}
