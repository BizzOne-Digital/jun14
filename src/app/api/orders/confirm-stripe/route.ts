import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const { sessionId } = (await request.json()) as { sessionId?: string };
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Not paid yet" }, { status: 400 });
  }

  const orderId = session.metadata?.orderId;
  if (!orderId || !ObjectId.isValid(orderId)) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  const db = await getDb();
  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { status: "paid", paidAt: new Date().toISOString() } }
  );

  return NextResponse.json({
    orderNumber: session.metadata?.orderNumber,
    status: "paid",
  });
}
