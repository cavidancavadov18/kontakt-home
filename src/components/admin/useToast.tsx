"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Toast = { id: number; message: string; type: "ok" | "err" };

type ToastCtx = {
  toast: (message: string, type?: "ok" | "err") => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 360,
        }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            style={{
              background: t.type === "ok" ? "#14532d" : "#7f1d1d",
              color: "#fff",
              border: `1px solid ${t.type === "ok" ? "#22c55e55" : "#ef444455"}`,
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              boxShadow: "0 8px 24px rgba(0,0,0,.35)",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast outside ToastProvider");
  return ctx;
}
