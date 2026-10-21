import { NextRequest, NextResponse } from "next/server";
import { readCollection } from "@/server/db";
import { isAdminError, requireAdmin } from "@/server/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (isAdminError(admin)) return admin;

  const orders = await readCollection("orders");
  const sorted = [...orders].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  return NextResponse.json({ orders: sorted });
}
