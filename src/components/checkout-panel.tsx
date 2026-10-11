"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";

type Props = {
  primaryColor: string;
  onBack: () => void;
  onSuccess: () => void;
};

export function CheckoutPanel({ primaryColor, onBack, onSuccess }: Props) {
  const { lines, subtotal, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in name, email, and phone.");
      return;
    }
    setLoading(true);
    try {
      const createRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone },
          fulfillment,
          notes,
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            price: l.price,
            quantity: l.quantity,
          })),
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error || "Could not create order");
      }

      if (createData.checkoutUrl) {
        window.location.href = createData.checkoutUrl;
        return;
      }

      const payRes = await fetch(`/api/orders/${createData.orderId}/pay`, {
        method: "POST",
      });
      const payData = await payRes.json();
      if (!payRes.ok) {
        throw new Error(payData.error || "Payment failed");
      }

      clear();
      onSuccess();
      alert(`Order ${payData.orderNumber} paid! Thank you.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        className="mb-4 text-sm text-stone-500 hover:text-stone-800"
        onClick={onBack}
      >
        ← Back to cart
      </button>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            className="box-border w-full min-w-0 rounded-lg border border-stone-200 px-3 py-2 text-base sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            className="box-border w-full min-w-0 rounded-lg border border-stone-200 px-3 py-2 text-base sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            type="tel"
            className="box-border w-full min-w-0 rounded-lg border border-stone-200 px-3 py-2 text-base sm:text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Order type</label>
          <select
            className="box-border w-full min-w-0 rounded-lg border border-stone-200 px-3 py-2 text-base sm:text-sm"
            value={fulfillment}
            onChange={(e) =>
              setFulfillment(e.target.value as "pickup" | "delivery")
            }
          >
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Notes (optional)</label>
          <textarea
            className="box-border w-full min-w-0 rounded-lg border border-stone-200 px-3 py-2 text-base sm:text-sm"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 border-t border-stone-200 pt-4">
        <div className="mb-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={handlePay}
          className="w-full rounded-full py-3 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          {loading ? "Processing…" : "Pay & place order"}
        </button>
        <p className="mt-2 text-center text-xs text-stone-500">
          Uses Stripe when configured; otherwise demo payment marks order as paid.
        </p>
      </div>
    </div>
  );
}
