"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Order } from "@/lib/types";

const NOTIFICATION_SRC = "/sounds/order-notification.mp3";
const POLL_MS = 4000;

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastPaidAtRef = useRef<string>(
    new Date(Date.now() - 60_000).toISOString()
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNotification = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(NOTIFICATION_SRC);
      }
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    } catch {
      /* user may not have added sound file yet */
    }
  }, []);

  const fetchOrders = useCallback(async (initial = false) => {
    try {
      const since = lastPaidAtRef.current;
      const res = await fetch(
        `/api/admin/orders?status=paid&since=${encodeURIComponent(since)}`
      );
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      const newOnes = (data.orders as Order[]) || [];

      if (!initial && newOnes.length > 0) {
        playNotification();
      }

      if (newOnes.length > 0) {
        const latest = newOnes.reduce((a, b) =>
          (a.paidAt || "") > (b.paidAt || "") ? a : b
        );
        if (latest.paidAt) lastPaidAtRef.current = latest.paidAt;
      }

      const allRes = await fetch("/api/admin/orders?status=paid");
      const allData = await allRes.json();
      setOrders((allData.orders as Order[]) || []);
      setError(null);
    } catch {
      setError("Could not load orders. Check MongoDB connection.");
    } finally {
      setLoading(false);
    }
  }, [playNotification]);

  useEffect(() => {
    void fetchOrders(true);
    const id = setInterval(() => void fetchOrders(false), POLL_MS);
    return () => clearInterval(id);
  }, [fetchOrders]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-clip bg-stone-100">
      <header className="border-b border-stone-200 bg-white px-3 py-3 sm:px-4 sm:py-4">
        <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-stone-900 sm:text-xl">Orders</h1>
            <p className="mt-1 text-xs text-stone-500 sm:text-sm">
              New paid orders play a sound — add your file at{" "}
              <code className="break-all text-xs">public/sounds/order-notification.mp3</code>
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="shrink-0 self-start text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl min-w-0 px-3 py-6 sm:px-4 sm:py-8">
        {loading && <p className="text-stone-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && orders.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-stone-500 shadow-sm">
            No paid orders yet.
          </p>
        )}

        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order._id || order.orderNumber}
              className="min-w-0 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="break-all font-semibold text-stone-900">
                    {order.orderNumber}
                  </p>
                  <p className="break-words text-sm text-stone-600">
                    {order.customer.name} · {order.customer.phone}
                  </p>
                  <p className="break-all text-sm text-stone-500">{order.customer.email}</p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="text-lg font-bold">${order.subtotal.toFixed(2)}</p>
                  <p className="text-xs uppercase tracking-wide text-green-700">
                    {order.status}
                  </p>
                  <p className="text-xs text-stone-400">
                    {order.paidAt
                      ? new Date(order.paidAt).toLocaleString()
                      : new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <ul className="mt-4 border-t border-stone-100 pt-3 text-sm text-stone-700">
                {order.items.map((item) => (
                  <li key={item.productId + item.name} className="break-words">
                    {item.quantity}× {item.name} — $
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-stone-500 capitalize">
                {order.fulfillment}
                {order.notes ? ` · Note: ${order.notes}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
