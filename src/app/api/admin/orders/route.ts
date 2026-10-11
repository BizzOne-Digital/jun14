import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { serializeOrder } from "@/lib/orders";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since");
  const status = searchParams.get("status") || "paid";

  try {
    const db = await getDb();
    const filter: Record<string, unknown> = { status };
    if (since) {
      filter.paidAt = { $gt: since };
    }

    const docs = await db
      .collection("orders")
      .find(filter)
      .sort({ paidAt: -1, createdAt: -1 })
      .limit(100)
      .toArray();

    const orders = docs.map((d) => serializeOrder(d as Record<string, unknown>));
    return NextResponse.json({ orders });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
