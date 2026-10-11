import type { Order } from "./types";

export function generateOrderNumber() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KD-${t}-${r}`;
}

export function serializeOrder(doc: Record<string, unknown>): Order {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    _id: _id ? String(_id) : undefined,
  } as Order;
}
