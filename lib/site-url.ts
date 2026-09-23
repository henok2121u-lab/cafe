import "server-only";
import { headers } from "next/headers";

/**
 * Builds the current request's origin from its headers rather than a fixed
 * env var, so the QR code always matches whatever domain the admin is
 * actually being viewed from (production domain in prod, localhost in dev).
 */
export async function getSiteOrigin() {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${proto}://${host}`;
}
