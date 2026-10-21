import { NextRequest, NextResponse } from "next/server";
import { readCollection } from "@/server/db";
import { getSessionFromRequest } from "@/server/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await getSessionFromRequest(req);
  const orders = await readCollection("orders");
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (auth) {
    const allowed =
      order.userId === auth.user.id || order.phone === auth.user.phone;
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ order });
}
