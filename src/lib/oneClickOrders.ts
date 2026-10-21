export type OneClickOrder = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  customerName: string;
  phone: string;
  qty: number;
  createdAt: string;
};

const STORAGE_KEY = "kh-one-click-orders";

export function saveOneClickOrder(
  order: Omit<OneClickOrder, "id" | "createdAt">
): OneClickOrder {
  const entry: OneClickOrder = {
    ...order,
    id: `oc-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const list = loadOneClickOrders();
  list.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  return entry;
}

export function loadOneClickOrders(): OneClickOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OneClickOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
