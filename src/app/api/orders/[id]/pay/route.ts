import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date().toISOString();
    const result = await db.collection("orders").findOneAndUpdate(
      { _id: new ObjectId(id), status: "pending_payment" },
      { $set: { status: "paid", paidAt: now } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Order not found or already paid" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderNumber: result.orderNumber,
      status: "paid",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
