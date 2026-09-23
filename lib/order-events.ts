import "server-only";
import { EventEmitter } from "node:events";

// A single Node EventEmitter shared by every request in this process. This
// only works because the app runs as ONE container instance (see Dockerfile
// / Dokploy compose) — if it were ever scaled to multiple replicas, events
// from an order placed on one instance wouldn't reach admins connected to
// another, and this would need to move to a real pub/sub (e.g. Redis).
const globalForEvents = globalThis as unknown as { orderEvents: EventEmitter | undefined };

// Unlike the Prisma client singleton pattern this mirrors, the globalThis
// write happens in every environment, not just dev: the goal here is
// sharing one emitter across separately-bundled modules (the SSE route
// handler vs. the order actions) within a single process, which matters in
// production too — not just avoiding duplicate instances across dev HMR
// reloads.
export const orderEvents = globalForEvents.orderEvents ?? new EventEmitter().setMaxListeners(50);
globalForEvents.orderEvents = orderEvents;

export const ORDER_EVENT = "order-update";
