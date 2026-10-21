export type KhAddress = {
  id: string;
  label: string;
  city: string;
  address: string;
  phone: string;
};

const STORAGE_KEY = "kh-addresses";

export function loadAddresses(): KhAddress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as KhAddress[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(list: KhAddress[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addAddress(
  data: Omit<KhAddress, "id">
): KhAddress {
  const entry: KhAddress = { ...data, id: `addr-${Date.now()}` };
  const list = loadAddresses();
  list.push(entry);
  persist(list);
  return entry;
}

export function updateAddress(id: string, data: Omit<KhAddress, "id">): void {
  const list = loadAddresses().map((a) =>
    a.id === id ? { ...data, id } : a
  );
  persist(list);
}

export function deleteAddress(id: string): void {
  persist(loadAddresses().filter((a) => a.id !== id));
}
