"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession, verifyPassword, hashPassword, requireAdmin } from "@/lib/auth";

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

export async function changePasswordAction(formData: FormData) {
  const session = await requireAdmin();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const user = await db.adminUser.findUnique({ where: { id: session.userId } });
  const currentValid = user ? await verifyPassword(currentPassword, user.passwordHash) : false;

  if (!currentValid) {
    redirect("/admin/settings?pwError=" + encodeURIComponent("Current password is incorrect."));
  }
  if (newPassword.length < 8) {
    redirect("/admin/settings?pwError=" + encodeURIComponent("New password must be at least 8 characters."));
  }
  if (newPassword !== confirmPassword) {
    redirect("/admin/settings?pwError=" + encodeURIComponent("New passwords don't match."));
  }

  await db.adminUser.update({
    where: { id: session.userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  redirect("/admin/settings?pwSaved=1");
}
