import { NextRequest, NextResponse } from "next/server";
import { readCollection } from "@/server/db";
import { isAdminError, requireAdmin } from "@/server/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (isAdminError(admin)) return admin;

  const [orders, users, tickets, oneClick, reviews] = await Promise.all([
    readCollection("orders"),
    readCollection("users"),
    readCollection("tickets"),
    readCollection("oneClick"),
    readCollection("reviews"),
  ]);

  return NextResponse.json({
    orders: orders.length,
    users: users.length,
    openTickets: tickets.filter((t) => t.status === "open").length,
    oneClick: oneClick.length,
    reviews: reviews.length,
    pendingPayments: orders.filter((o) => o.payment.status === "pending").length,
  });
}
