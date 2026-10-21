"use client";

// Credentials: username superadmin OR admin · password admin

import { useRouter } from "next/navigation";
import { useState, type CSSProperties, type FormEvent } from "react";
import { adminFetch } from "@/components/admin/adminFetch";
import { admin } from "@/components/admin/adminStyles";
import { Btn, Input } from "@/components/admin/DataTable";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await adminFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Giriş uğursuz");
      return;
    }
    router.replace("/admin");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: admin.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: admin.panel,
          border: `1px solid ${admin.border}`,
          borderRadius: 12,
          padding: "32px 28px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: admin.accent,
            textTransform: "uppercase",
          }}
        >
          Kontakt Home
        </div>
        <h1
          style={{
            margin: "8px 0 4px",
            fontSize: 22,
            fontWeight: 700,
            color: admin.text,
          }}
        >
          Admin giriş
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: admin.muted }}>
          İdarəetmə paneli üçün hesabınızla daxil olun.
        </p>

        <label style={labelStyle}>İstifadəçi adı</label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoFocus
          required
        />

        <label style={{ ...labelStyle, marginTop: 14 }}>Şifrə</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error ? (
          <div
            style={{
              marginTop: 14,
              padding: "8px 12px",
              background: "#7f1d1d33",
              border: "1px solid #ef444455",
              borderRadius: 6,
              color: "#f87171",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        ) : null}

        <Btn
          type="submit"
          variant="primary"
          disabled={loading}
          style={{ width: "100%", marginTop: 20, padding: "10px 14px" }}
        >
          {loading ? "Gözləyin…" : "Daxil ol"}
        </Btn>
      </form>
    </div>
  );
}

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: admin.muted,
  marginBottom: 6,
};
