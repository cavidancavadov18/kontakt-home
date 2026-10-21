"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { adminFetch } from "./adminFetch";
import { admin } from "./adminStyles";
import { ToastProvider, useToast } from "./useToast";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/orders", label: "Sifarişlər" },
  { href: "/admin/users", label: "İstifadəçilər" },
  { href: "/admin/stock", label: "Stok" },
  { href: "/admin/reviews", label: "Rəylər" },
  { href: "/admin/tickets", label: "Ticketlər" },
  { href: "/admin/one-click", label: "Bir klik" },
  { href: "/admin/products", label: "Məhsullar" },
];

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const isLogin = pathname === "/admin/login";
  const [username, setUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(!isLogin);

  useEffect(() => {
    if (isLogin) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await adminFetch<{ username: string }>("/api/admin/me");
      if (cancelled) return;
      if (!res.ok) {
        router.replace("/admin/login");
        return;
      }
      setUsername(res.data.username);
      setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isLogin, pathname, router]);

  async function logout() {
    await adminFetch("/api/admin/logout", { method: "POST" });
    toast("Çıxış edildi");
    router.replace("/admin/login");
  }

  if (isLogin) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: admin.bg,
          color: admin.muted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        Yoxlanılır…
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: admin.bg,
        color: admin.text,
        display: "flex",
      }}
    >
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: admin.panel,
          borderRight: `1px solid ${admin.border}`,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "20px 18px 16px",
            borderBottom: `1px solid ${admin.border}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: admin.accent,
              textTransform: "uppercase",
            }}
          >
            Kontakt
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>
            Admin Panel
          </div>
        </div>
        <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  padding: "9px 12px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#fff" : admin.muted,
                  background: active ? `${admin.accent}22` : "transparent",
                  borderLeft: active
                    ? `2px solid ${admin.accent}`
                    : "2px solid transparent",
                  textDecoration: "none",
                  marginBottom: 2,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div
          style={{
            padding: "12px 14px",
            borderTop: `1px solid ${admin.border}`,
            fontSize: 12,
            color: admin.muted,
          }}
        >
          v1 · {username}
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            height: 52,
            borderBottom: `1px solid ${admin.border}`,
            background: admin.panel,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 13, color: admin.muted }}>
            {pathname}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: admin.text, fontWeight: 500 }}>
              {username}
            </span>
            <button
              type="button"
              onClick={logout}
              style={{
                background: "transparent",
                border: `1px solid ${admin.border}`,
                color: admin.muted,
                borderRadius: 6,
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Çıxış
            </button>
          </div>
        </header>
        <main style={{ padding: 24, flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ShellInner>{children}</ShellInner>
    </ToastProvider>
  );
}
