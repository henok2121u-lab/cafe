"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { DAY_ORDER } from "@/lib/data/settings";

const settingsSchema = z.object({
  name: z.string().trim().min(1, "Café name is required").max(150),
  address: z.string().trim().max(300).optional(),
  phone: z.string().trim().max(50).optional(),
  email: z.string().trim().email("Invalid email").max(150).optional().or(z.literal("")),
  mapEmbedUrl: z.string().trim().max(2000).optional(),
  facebookUrl: z.string().trim().max(300).optional(),
  instagramUrl: z.string().trim().max(300).optional(),
});

function emptyToUndefined(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str.length > 0 ? str : undefined;
}

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin();

  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    address: emptyToUndefined(formData.get("address")),
    phone: emptyToUndefined(formData.get("phone")),
    email: emptyToUndefined(formData.get("email")) ?? "",
    mapEmbedUrl: emptyToUndefined(formData.get("mapEmbedUrl")),
    facebookUrl: emptyToUndefined(formData.get("facebookUrl")),
    instagramUrl: emptyToUndefined(formData.get("instagramUrl")),
  });

  if (!parsed.success) {
    redirect(`/admin/settings?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const openingHours: Record<string, string> = {};
  for (const day of DAY_ORDER) {
    const value = emptyToUndefined(formData.get(`hours_${day}`));
    if (value) openingHours[day] = value;
  }

  const data = {
    name: parsed.data.name,
    address: parsed.data.address ?? null,
    phone: parsed.data.phone ?? null,
    email: parsed.data.email || null,
    mapEmbedUrl: parsed.data.mapEmbedUrl ?? null,
    facebookUrl: parsed.data.facebookUrl ?? null,
    instagramUrl: parsed.data.instagramUrl ?? null,
    openingHours: Object.keys(openingHours).length > 0 ? openingHours : undefined,
  };

  await db.cafeSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  revalidatePath("/");
  revalidatePath("/location");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
