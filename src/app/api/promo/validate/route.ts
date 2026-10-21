import { NextRequest, NextResponse } from "next/server";
import { validatePromo } from "@/server/promo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { code?: string; subtotal?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const subtotal = Number(body.subtotal);
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return NextResponse.json({ error: "Invalid subtotal" }, { status: 400 });
  }

  const result = validatePromo(body.code, subtotal);
  return NextResponse.json(result);
}
