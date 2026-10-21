import fs from "node:fs/promises";
import path from "node:path";

const DB_DIR = path.join(process.cwd(), "data", "db");

export type User = {
  id: string;
  phone: string;
  name: string;
  createdAt: string;
};

export type DbSession = {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export type OtpRecord = {
  phone: string;
  code: string;
  expiresAt: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  userId: string | null;
  phone: string;
  createdAt: string;
  locale: "az" | "ru";
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    note: string;
  };
  payment: {
    method: "cash" | "card" | "installment";
    installmentMonths?: number;
    status: "paid" | "pending";
    transactionId?: string;
  };
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promoCode: string | null;
  stockReserved: boolean;
};

export type Review = {
  id: string;
  slug: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type Address = {
  id: string;
  userId: string;
  label: string;
  city: string;
  line: string;
  isDefault: boolean;
  createdAt: string;
};

export type Ticket = {
  id: string;
  message: string;
  phone: string | null;
  userId: string | null;
  createdAt: string;
  status: "open" | "closed";
};

export type OneClickRecord = {
  id: string;
  name: string;
  phone: string;
  productId: string;
  slug: string;
  productName: string;
  createdAt: string;
};

export type StockEntry = {
  productId: string;
  qty: number;
  reserved: number;
};

type CollectionMap = {
  users: User[];
  sessions: DbSession[];
  otps: OtpRecord[];
  orders: Order[];
  reviews: Review[];
  addresses: Address[];
  tickets: Ticket[];
  stock: StockEntry[];
  oneClick: OneClickRecord[];
};

const COLLECTIONS: (keyof CollectionMap)[] = [
  "users",
  "sessions",
  "otps",
  "orders",
  "reviews",
  "addresses",
  "tickets",
  "stock",
  "oneClick",
];

let dirReady: Promise<void> | null = null;

export async function ensureDbDir(): Promise<void> {
  if (!dirReady) {
    dirReady = fs.mkdir(DB_DIR, { recursive: true }).then(() => undefined);
  }
  await dirReady;
}

function filePath(name: keyof CollectionMap): string {
  return path.join(DB_DIR, `${name}.json`);
}

async function readRaw(name: keyof CollectionMap): Promise<unknown[]> {
  await ensureDbDir();
  const fp = filePath(name);
  try {
    const raw = await fs.readFile(fp, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function writeRaw(name: keyof CollectionMap, data: unknown[]): Promise<void> {
  await ensureDbDir();
  const fp = filePath(name);
  const tmp = `${fp}.${process.pid}.${Date.now()}.tmp`;
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(tmp, payload, "utf8");
  await fs.rename(tmp, fp);
}

export async function readCollection<K extends keyof CollectionMap>(
  name: K
): Promise<CollectionMap[K]> {
  return (await readRaw(name)) as CollectionMap[K];
}

export async function writeCollection<K extends keyof CollectionMap>(
  name: K,
  data: CollectionMap[K]
): Promise<void> {
  await writeRaw(name, data as unknown[]);
}

export async function mutateCollection<K extends keyof CollectionMap, T>(
  name: K,
  fn: (items: CollectionMap[K]) => T
): Promise<T> {
  const items = await readCollection(name);
  const result = fn(items);
  await writeCollection(name, items);
  return result;
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function initEmptyCollections(): Promise<void> {
  await ensureDbDir();
  for (const name of COLLECTIONS) {
    const fp = filePath(name);
    try {
      await fs.access(fp);
    } catch {
      await writeRaw(name, []);
    }
  }
}
