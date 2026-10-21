import { createHash } from "node:crypto";
import { stores } from "@/data/stores";
import { mutateCollection, readCollection, type StockEntry } from "./db";

function hashQty(productId: string): number {
  const h = createHash("sha256").update(productId).digest();
  return 5 + (h[0] % 36);
}

async function getOrInitEntry(productId: string): Promise<StockEntry> {
  const stock = await readCollection("stock");
  let entry = stock.find((s) => s.productId === productId);
  if (!entry) {
    entry = { productId, qty: hashQty(productId), reserved: 0 };
  }
  return entry;
}

export async function getStock(productId: string): Promise<number> {
  const entry = await getOrInitEntry(productId);
  return Math.max(0, entry.qty - entry.reserved);
}

export async function reserveStock(
  productId: string,
  qty: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (qty <= 0) return { ok: true };
  return mutateCollection("stock", (list) => {
    let entry = list.find((s) => s.productId === productId);
    if (!entry) {
      entry = { productId, qty: hashQty(productId), reserved: 0 };
      list.push(entry);
    }
    const available = entry.qty - entry.reserved;
    if (available < qty) {
      return { ok: false as const, error: "Insufficient stock" };
    }
    entry.reserved += qty;
    return { ok: true as const };
  });
}

export async function releaseStock(productId: string, qty: number): Promise<void> {
  if (qty <= 0) return;
  await mutateCollection("stock", (list) => {
    const entry = list.find((s) => s.productId === productId);
    if (entry) {
      entry.reserved = Math.max(0, entry.reserved - qty);
    }
  });
}

function storeCountForProduct(productId: string): number {
  const h = createHash("sha256").update(`stores:${productId}`).digest();
  return 3 + (h[1] % 3);
}

function storeQty(productId: string, storeId: string): number {
  const h = createHash("sha256").update(`${productId}:${storeId}`).digest();
  return 1 + (h[0] % 8);
}

export function getStoreAvailability(productId: string): {
  id: string;
  name: { az: string; ru: string };
  qty: number;
  lat: number;
  lng: number;
}[] {
  const count = storeCountForProduct(productId);
  const h = createHash("sha256").update(productId).digest();
  const start = h[2] % stores.length;
  const picked: typeof stores = [];
  for (let i = 0; i < stores.length && picked.length < count; i++) {
    picked.push(stores[(start + i) % stores.length]);
  }
  return picked.map((store) => ({
    id: store.id,
    name: store.name,
    qty: storeQty(productId, store.id),
    lat: store.lat,
    lng: store.lng,
  }));
}
