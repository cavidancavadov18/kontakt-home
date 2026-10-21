import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { computeCartPricing } from "@/lib/cartPricing";
import { mutateCollection, newId, readCollection, type Order } from "@/server/db";
import { normalizePhone } from "@/server/phone";
import { validatePromo } from "@/server/promo";
import { getSessionFromRequest } from "@/server/session";
import { reserveStock } from "@/server/stock";

export const dynamic = "force-dynamic";

type OrderItemInput = {
  productId: string;
  qty: number;
};

type CreateOrderBody = {
  locale?: "az" | "ru";
  items: OrderItemInput[];
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    note?: string;
  };
  payment: {
    method: "cash" | "card" | "installment";
    installmentMonths?: number;
  };
  promoCode?: string | null;
};

export async function GET(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const phone = auth.user.phone;
  const orders = await readCollection("orders");
  const list = orders.filter(
    (o) => o.phone === phone || o.userId === auth.user.id
  );
  return NextResponse.json({ orders: list });
}

export async function POST(req: NextRequest) {
  let body: CreateOrderBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.items?.length || !body.customer?.phone || !body.customer?.name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const auth = await getSessionFromRequest(req);
  const phone = normalizePhone(body.customer.phone);

  const orderItems: Order["items"] = [];
  let subtotal = 0;

  for (const line of body.items) {
    const product = products.find((p) => p.id === line.productId);
    if (!product || !line.qty || line.qty < 1) {
      return NextResponse.json(
        { error: `Invalid item: ${line.productId}` },
        { status: 400 }
      );
    }
    const reserve = await reserveStock(product.id, line.qty);
    if (!reserve.ok) {
      return NextResponse.json(
        { error: `Out of stock: ${product.slug}` },
        { status: 409 }
      );
    }
    orderItems.push({
      productId: product.id,
      slug: product.slug,
      name: product.name.az,
      qty: line.qty,
      unitPrice: product.price,
    });
    subtotal += product.price * line.qty;
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const promoResult = validatePromo(body.promoCode ?? null, subtotal);
  const fallback = computeCartPricing(subtotal, null);
  const discount =
    promoResult.valid === true ? promoResult.discount : fallback.discount;
  const deliveryFee =
    promoResult.valid === true ? promoResult.deliveryFee : fallback.deliveryFee;
  const total =
    promoResult.valid === true ? promoResult.grandTotal : fallback.grandTotal;

  const order: Order = {
    id: `KH-${Date.now().toString().slice(-8)}`,
    userId: auth?.user.id ?? null,
    phone,
    createdAt: new Date().toISOString(),
    locale: body.locale === "ru" ? "ru" : "az",
    items: orderItems,
    customer: {
      name: body.customer.name.trim(),
      phone,
      city: body.customer.city?.trim() || "",
      address: body.customer.address?.trim() || "",
      note: body.customer.note?.trim() || "",
    },
    payment: {
      method: body.payment.method,
      installmentMonths: body.payment.installmentMonths,
      status: body.payment.method === "card" ? "pending" : "paid",
      transactionId:
        body.payment.method !== "card"
          ? `txn-${newId("pay").slice(4)}`
          : undefined,
    },
    subtotal,
    discount,
    deliveryFee,
    total,
    promoCode: promoResult.valid ? promoResult.code : null,
    stockReserved: true,
  };

  if (body.payment.method === "cash" || body.payment.method === "installment") {
    order.payment.status = "paid";
  }

  await mutateCollection("orders", (orders) => {
    orders.unshift(order);
  });

  return NextResponse.json({ order }, { status: 201 });
}
