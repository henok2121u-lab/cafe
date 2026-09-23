import { readFile } from "node:fs/promises";
import path from "node:path";

function uploadDir() {
  return process.env.UPLOAD_DIR ?? "./uploads";
}

export async function GET(_req: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path: segments } = await ctx.params;

  // Every upload is saved as a flat random-UUID filename (see lib/uploads.ts),
  // so a single non-traversable segment is all that's ever valid here.
  if (segments.length !== 1 || segments[0].includes("..") || segments[0].includes("/")) {
    return new Response("Not found", { status: 404 });
  }

  // Files live in a runtime-mounted volume outside the app bundle, not a
  // build-time dependency, so this must not pull the whole project into
  // Next's output-file-tracing scan.
  const filePath = path.join(/* turbopackIgnore: true */ uploadDir(), segments[0]);

  try {
    const data = await readFile(/* turbopackIgnore: true */ filePath);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
