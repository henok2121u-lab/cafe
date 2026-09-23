import { getCafeSettings, DAY_ORDER, dayLabel, type OpeningHours } from "@/lib/data/settings";
import { updateSettingsAction } from "@/lib/actions/settings";
import { changePasswordAction } from "@/lib/actions/auth";

export default async function AdminSettingsPage(props: PageProps<"/admin/settings">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;
  const saved = searchParams.saved === "1";
  const pwError = typeof searchParams.pwError === "string" ? searchParams.pwError : undefined;
  const pwSaved = searchParams.pwSaved === "1";

  const settings = await getCafeSettings();
  const hours = (settings.openingHours ?? {}) as OpeningHours;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Café Settings</h1>

      {saved && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Settings saved.</p>
      )}
      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form action={updateSettingsAction} className="mt-6 max-w-lg space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Café Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={settings.name}
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-foreground">
            Address
          </label>
          <input
            id="address"
            name="address"
            defaultValue={settings.address ?? ""}
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="phone" className="block text-sm font-medium text-foreground">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={settings.phone ?? ""}
              className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email ?? ""}
              className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="mapEmbedUrl" className="block text-sm font-medium text-foreground">
            Google Maps embed URL
          </label>
          <input
            id="mapEmbedUrl"
            name="mapEmbedUrl"
            placeholder="https://www.google.com/maps/embed?..."
            defaultValue={settings.mapEmbedUrl ?? ""}
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-cafe-muted">
            In Google Maps: Share → Embed a map → copy the src URL from the iframe code.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="facebookUrl" className="block text-sm font-medium text-foreground">
              Facebook URL
            </label>
            <input
              id="facebookUrl"
              name="facebookUrl"
              defaultValue={settings.facebookUrl ?? ""}
              className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="instagramUrl" className="block text-sm font-medium text-foreground">
              Instagram URL
            </label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              defaultValue={settings.instagramUrl ?? ""}
              className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-foreground">Opening Hours</legend>
          <div className="mt-2 space-y-2">
            {DAY_ORDER.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <label htmlFor={`hours_${day}`} className="w-24 text-sm text-cafe-muted">
                  {dayLabel(day)}
                </label>
                <input
                  id={`hours_${day}`}
                  name={`hours_${day}`}
                  placeholder="e.g. 7:00 - 18:00 or Closed"
                  defaultValue={hours[day] ?? ""}
                  className="flex-1 rounded-md border border-cafe-border px-3 py-1.5 text-sm"
                />
              </div>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-md bg-cafe-primary px-4 py-2 text-sm font-semibold text-cafe-primary-foreground hover:opacity-90"
        >
          Save Settings
        </button>
      </form>

      <h2 className="mt-12 text-xl font-semibold text-foreground">Change Password</h2>

      {pwSaved && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Password updated.</p>
      )}
      {pwError && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{pwError}</p>}

      <form action={changePasswordAction} className="mt-6 max-w-sm space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground">
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md border border-cafe-border px-4 py-2 text-sm font-semibold hover:border-cafe-primary"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
