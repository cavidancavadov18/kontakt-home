"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import { apiGet, apiPost } from "@/lib/api";
import { clearUser, loadUser, saveUser, type KhUser } from "@/lib/user";

type CartItem = { product: Product; qty: number };

type AppContextValue = {
  user: KhUser | null;
  login: (user: KhUser) => void;
  logout: () => void;
  updateProfile: (patch: Partial<KhUser>) => void;
  cart: CartItem[];
  favorites: string[];
  compare: string[];
  promoCode: string | null;
  setPromoCode: (code: string | null) => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleCompare: (id: string) => boolean;
  isCompare: (id: string) => boolean;
  clearCompare: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<KhUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [promoCode, setPromoCodeState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedCart = loadJson<CartItem[]>("kh-cart-v2", []);
    if (savedCart.length) {
      setCart(savedCart.filter((c) => c?.product?.id));
    } else {
      localStorage.removeItem("kh-cart");
    }
    setFavorites(loadJson<string[]>("kh-fav", []));
    setCompare(loadJson<string[]>("kh-cmp", []));
    try {
      const promo = sessionStorage.getItem("kh-promo");
      if (promo) setPromoCodeState(promo.toUpperCase());
    } catch {
      /* ignore */
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet<{
          user: { id: string; phone: string; name: string };
        }>("/api/auth/me");
        if (!cancelled && data.user?.phone) {
          const next: KhUser = {
            id: data.user.id,
            phone: data.user.phone,
            name: data.user.name,
          };
          saveUser(next);
          setUser(next);
        }
      } catch {
        if (!cancelled) setUser(loadUser());
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setPromoCode = useCallback((code: string | null) => {
    const normalized = code?.trim().toUpperCase() || null;
    setPromoCodeState(normalized);
    try {
      if (normalized) sessionStorage.setItem("kh-promo", normalized);
      else sessionStorage.removeItem("kh-promo");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("kh-cart-v2", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("kh-fav", JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("kh-cmp", JSON.stringify(compare));
  }, [compare, hydrated]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prev, { product, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((c) => c.product.id !== id));
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.product.id === id ? { ...c, qty } : c))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleCompare = useCallback((id: string) => {
    let ok = true;
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) {
        ok = false;
        return prev;
      }
      return [...prev, id];
    });
    return ok;
  }, []);

  const isCompare = useCallback((id: string) => compare.includes(id), [compare]);
  const clearCompare = useCallback(() => setCompare([]), []);

  const login = useCallback((next: KhUser) => {
    saveUser(next);
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    void apiPost("/api/auth/logout").catch(() => {});
    clearUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback((patch: Partial<KhUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      saveUser(next);
      return next;
    });
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, c) => sum + c.qty, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => cart.reduce((sum, c) => sum + c.product.price * c.qty, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateProfile,
      cart,
      favorites,
      compare,
      promoCode,
      setPromoCode,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      cartTotal,
      toggleFavorite,
      isFavorite,
      toggleCompare,
      isCompare,
      clearCompare,
    }),
    [
      user,
      login,
      logout,
      updateProfile,
      cart,
      favorites,
      compare,
      promoCode,
      setPromoCode,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      cartTotal,
      toggleFavorite,
      isFavorite,
      toggleCompare,
      isCompare,
      clearCompare,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
