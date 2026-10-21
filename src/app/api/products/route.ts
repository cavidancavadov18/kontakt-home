import { products } from "@/data/products";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!ids.length) {
    return NextResponse.json({ items: [] });
  }

  const idSet = new Set(ids);
  const items = products.filter((p) => idSet.has(p.id));
  return NextResponse.json({ items });
}
