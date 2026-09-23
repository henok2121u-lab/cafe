"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  const user = email ? await db.adminUser.findUnique({ where: { email } }) : null;
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }

  await createSession(user.id);
  redirect(safeNext);
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
