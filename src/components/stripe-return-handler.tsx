"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function StripeReturnHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const order = searchParams.get("order");
    if (order === "success" && sessionId) {
      void fetch("/api/orders/confirm-stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).then(() => {
        window.history.replaceState({}, "", "/");
        alert("Payment successful! Thank you for your order.");
      });
    }
  }, [searchParams]);

  return null;
}
