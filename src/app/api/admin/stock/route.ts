import { NextRequest, NextResponse } from "next/server";
import { mutateCollection, readCollection, type StockEntry } from "@/server/db";
import { isAdminError, requireAdmin } from "@/server/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (isAdminError(admin)) return admin;

  const stock = await readCollection("stock");
  return NextResponse.json({ stock });
}

export async function PATCH(req: NextRequest) {
  const admin = requireAdmin(req);
  if (isAdminError(admin)) return admin;

  let body: { productId?: string; qty?: number; reserved?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const productId = body.productId?.trim();
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const qty = Number(body.qty);
  const reserved = Number(body.reserved);
  if (!Number.isFinite(qty) || qty < 0 || !Number.isFinite(reserved) || reserved < 0) {
    return NextResponse.json(
      { error: "qty and reserved must be non-negative numbers" },
      { status: 400 }
    );
  }

  const entry = await mutateCollection("stock", (list) => {
    let found = list.find((s) => s.productId === productId);
    if (!found) {
      found = { productId, qty: 0, reserved: 0 };
      list.push(found);
    }
    found.qty = Math.floor(qty);
    found.reserved = Math.floor(reserved);
    return { ...found } as StockEntry;
  });

  return NextResponse.json({ entry });
}
