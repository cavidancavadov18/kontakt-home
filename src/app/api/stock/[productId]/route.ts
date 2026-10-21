import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { getStock, getStoreAvailability } from "@/server/stock";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ productId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { productId } = await params;
  const product =
    products.find((p) => p.id === productId) ||
    products.find((p) => p.slug === productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const qty = await getStock(product.id);
  const storeRows = getStoreAvailability(product.id);
  const stores = storeRows.map((s) => ({
    id: s.id,
    name: s.name,
    qty: s.qty,
  }));

  return NextResponse.json({ qty, stores });
}
