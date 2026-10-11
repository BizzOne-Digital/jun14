import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!secret || !stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId && ObjectId.isValid(orderId)) {
      const db = await getDb();
      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: "paid", paidAt: new Date().toISOString() } }
      );
    }
  }

  return NextResponse.json({ received: true });
}
