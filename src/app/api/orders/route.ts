import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/mongodb";
import { generateOrderNumber } from "@/lib/orders";
import type { OrderItem } from "@/lib/types";

type CreateBody = {
  customer: { name: string; email: string; phone: string };
  fulfillment: "pickup" | "delivery";
  notes?: string;
  items: OrderItem[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateBody;
    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    const subtotal = body.items.reduce(
      (s, i) => s + i.price * i.quantity,
      0
    );
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const order = {
      orderNumber,
      customer: body.customer,
      fulfillment: body.fulfillment,
      notes: body.notes || "",
      items: body.items,
      subtotal,
      status: "pending_payment" as const,
      createdAt: now,
    };

    const db = await getDb();
    const result = await db.collection("orders").insertOne(order);
    const orderId = result.insertedId.toString();

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (stripeKey) {
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: body.customer.email,
        line_items: body.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.price * 100),
            product_data: { name: item.name },
          },
        })),
        metadata: { orderId, orderNumber },
        success_url: `${appUrl}/?order=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/?order=cancelled`,
      });
      return NextResponse.json({
        orderId,
        orderNumber,
        checkoutUrl: session.url,
      });
    }

    return NextResponse.json({ orderId, orderNumber });
  } catch (e) {
    console.error(e);
    const message =
      e instanceof Error ? e.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
