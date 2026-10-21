export type KhUser = {
  id?: string;
  phone: string;
  name: string;
};

const STORAGE_KEY = "kh-user";

export function loadUser(): KhUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as KhUser;
    if (parsed?.phone) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveUser(user: KhUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}
