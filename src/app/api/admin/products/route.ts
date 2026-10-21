import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { isAdminError, requireAdmin } from "@/server/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (isAdminError(admin)) return admin;

  const q = (req.nextUrl.searchParams.get("q") || "").trim().toLowerCase();
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 20)
  );

  let filtered = products;
  if (q) {
    filtered = products.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.name.az.toLowerCase().includes(q) ||
        p.name.ru.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    image: p.image,
    sku: p.sku,
  }));

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
  });
}
