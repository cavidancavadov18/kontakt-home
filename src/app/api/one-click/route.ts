import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { mutateCollection, newId, type OneClickRecord } from "@/server/db";
import { normalizePhone } from "@/server/phone";
import { getSessionFromRequest } from "@/server/session";

export const dynamic = "force-dynamic";

type OneClickBody = {
  name: string;
  phone: string;
  productId: string;
  slug: string;
  productName: string;
};

export async function POST(req: NextRequest) {
  let body: OneClickBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name?.trim() || !body.phone?.trim() || !body.productId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const product = products.find(
    (p) => p.id === body.productId || p.slug === body.slug
  );
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const auth = await getSessionFromRequest(req);
  const record: OneClickRecord = {
    id: newId("oc"),
    name: body.name.trim(),
    phone: normalizePhone(body.phone),
    productId: product.id,
    slug: body.slug || product.slug,
    productName: body.productName?.trim() || product.name.az,
    createdAt: new Date().toISOString(),
  };

  await mutateCollection("oneClick", (list) => {
    list.unshift(record);
  });

  return NextResponse.json(
    { ok: true, order: record, userId: auth?.user.id ?? null },
    { status: 201 }
  );
}
