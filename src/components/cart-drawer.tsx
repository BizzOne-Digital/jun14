"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { CheckoutPanel } from "./checkout-panel";

type Props = {
  primaryColor: string;
};

export function CartDrawer({ primaryColor }: Props) {
  const { lines, isOpen, setOpen, subtotal, updateQuantity, removeItem, clear } =
    useCart();
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex w-full justify-end overflow-hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
        onClick={() => {
          setCheckout(false);
          setOpen(false);
        }}
      />
      <aside
        className="relative flex h-[100dvh] w-full min-w-0 max-w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-w-md"
        role="dialog"
        aria-labelledby="cart-title"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
          <h2 id="cart-title" className="text-lg font-semibold">
            {checkout ? "Checkout" : "Your cart"}
          </h2>
          <button
            type="button"
            className="text-stone-500 hover:text-stone-800"
            onClick={() => {
              setCheckout(false);
              setOpen(false);
            }}
          >
            Close
          </button>
        </div>

        {checkout ? (
          <CheckoutPanel
            primaryColor={primaryColor}
            onBack={() => setCheckout(false)}
            onSuccess={() => {
              clear();
              setCheckout(false);
              setOpen(false);
            }}
          />
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              {lines.length === 0 ? (
                <p className="text-center text-stone-500 py-8">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {lines.map((line) => (
                    <li
                      key={line.productId}
                      className="flex gap-3 border-b border-stone-100 pb-4"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {line.image && (
                          <Image
                            src={line.image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-medium leading-snug">
                          {line.name}
                        </p>
                        <p className="text-sm text-stone-500">
                          ${line.price.toFixed(2)}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="h-8 w-8 rounded-full border border-stone-200 text-lg leading-none"
                            onClick={() =>
                              updateQuantity(line.productId, line.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            className="h-8 w-8 rounded-full border border-stone-200 text-lg leading-none"
                            onClick={() =>
                              updateQuantity(line.productId, line.quantity + 1)
                            }
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="ml-auto text-xs text-red-600"
                            onClick={() => removeItem(line.productId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="shrink-0 border-t border-stone-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="mb-4 flex justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                disabled={lines.length === 0}
                onClick={() => setCheckout(true)}
                className="w-full rounded-full py-3 text-sm font-semibold text-white disabled:opacity-40"
                style={{ backgroundColor: primaryColor }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
