import { NextRequest, NextResponse } from "next/server";
import { mutateCollection, newId } from "@/server/db";
import { isAdminError, requireAdmin } from "@/server/requireAdmin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = requireAdmin(req);
  if (isAdminError(admin)) return admin;

  const { id } = await params;
  let body: { payment?: { status?: "paid" | "pending" }; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = body.payment?.status;
  if (status !== "paid" && status !== "pending") {
    return NextResponse.json(
      { error: "payment.status must be paid|pending" },
      { status: 400 }
    );
  }

  const order = await mutateCollection("orders", (orders) => {
    const found = orders.find((o) => o.id === id);
    if (!found) return null;
    found.payment.status = status;
    if (status === "paid" && !found.payment.transactionId) {
      found.payment.transactionId = `txn-${newId("pay").slice(4)}`;
    }
    if (typeof body.note === "string") {
      found.customer.note = body.note.trim();
    }
    return found;
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}
