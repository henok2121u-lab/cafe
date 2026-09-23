import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loginAction } from "@/lib/actions/auth";

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams;
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  const hasError = searchParams.error === "1";
  const next = typeof searchParams.next === "string" ? searchParams.next : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-xl border border-cafe-border bg-cafe-surface p-8">
        <h1 className="text-xl font-semibold text-foreground">Admin Login</h1>
        <p className="mt-1 text-sm text-cafe-muted">Sign in to manage the menu and site content.</p>

        {hasError && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid email or password.
          </p>
        )}

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm focus:border-cafe-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-cafe-border px-3 py-2 text-sm focus:border-cafe-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-cafe-primary px-4 py-2 text-sm font-semibold text-cafe-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
