import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export type OpeningHours = Partial<
  Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", string>
>;

const DAY_LABELS: Record<keyof OpeningHours, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export function dayLabel(day: keyof OpeningHours) {
  return DAY_LABELS[day];
}

/** Falls back to sensible placeholder copy so the site never renders blank before the owner fills in real details. */
export const getCafeSettings = cache(async function getCafeSettings() {
  const settings = await db.cafeSettings.findUnique({ where: { id: 1 } });
  if (settings) return settings;

  return {
    id: 1,
    name: "Your Café Name",
    address: null,
    phone: null,
    email: null,
    openingHours: null,
    mapEmbedUrl: null,
    facebookUrl: null,
    instagramUrl: null,
    updatedAt: new Date(),
  };
});
