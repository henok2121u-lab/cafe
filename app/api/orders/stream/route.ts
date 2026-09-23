import { getSession } from "@/lib/auth";
import { orderEvents, ORDER_EVENT } from "@/lib/order-events";

export const dynamic = "force-dynamic";

// Admin-only live feed of order changes. Not covered by proxy.ts (which
// only matches /admin/**), so auth is checked directly here.
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      const onUpdate = (payload: unknown) => send(payload);
      orderEvents.on(ORDER_EVENT, onUpdate);

      // Comment ping keeps the connection alive through proxies that would
      // otherwise time out an idle HTTP response.
      const keepAlive = setInterval(() => controller.enqueue(encoder.encode(": ping\n\n")), 20000);

      send({ type: "connected" });

      request.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        orderEvents.off(ORDER_EVENT, onUpdate);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
