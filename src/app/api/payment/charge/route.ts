import { NextRequest, NextResponse } from "next/server";
import { expiryOk, luhnOk } from "@/lib/card";
import { mutateCollection, newId } from "@/server/db";

export const dynamic = "force-dynamic";

type ChargeBody = {
  orderId: string;
  method: "card" | "cash" | "installment";
  card?: {
    number?: string;
    expiry?: string;
    cvv?: string;
  };
};

export async function POST(req: NextRequest) {
  let body: ChargeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  if (body.method === "card") {
    const digits = body.card?.number?.replace(/\D/g, "") || "";
    const cvv = body.card?.cvv?.replace(/\D/g, "") || "";
    if (!luhnOk(digits) || !expiryOk(body.card?.expiry || "") || cvv.length < 3) {
      return NextResponse.json({ error: "Invalid card" }, { status: 400 });
    }
  }

  const transactionId = `txn-${newId("pay").slice(4)}`;
  let found = false;

  await mutateCollection("orders", (orders) => {
    const order = orders.find((o) => o.id === body.orderId);
    if (!order) return;
    found = true;
    order.payment.status = "paid";
    order.payment.transactionId = transactionId;
    if (body.method) {
      order.payment.method = body.method;
    }
  });

  if (!found) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, transactionId });
}
