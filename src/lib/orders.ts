export type SavedOrder = {
  id: string;
  createdAt: string;
  locale: "az" | "ru";
  items: {
    productId: string;
    slug: string;
    name: string;
    qty: number;
    unitPrice: number;
  }[];
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
  };
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promoCode: string | null;
};

const STORAGE_KEY = "kh-orders";

export function saveOrder(
  order: Omit<SavedOrder, "id" | "createdAt">
): SavedOrder {
  const entry: SavedOrder = {
    ...order,
    id: `KH-${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
  };

  const list = loadOrders();
  list.unshift(entry);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 100)));
  }
  return entry;
}

export function loadOrders(): SavedOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
