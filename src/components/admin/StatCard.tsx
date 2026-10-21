"use client";

import { admin } from "./adminStyles";

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div
      style={{
        background: admin.panel,
        border: `1px solid ${admin.border}`,
        borderRadius: 10,
        padding: "16px 18px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: admin.muted,
          fontWeight: 500,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: admin.text,
          marginTop: 6,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {hint ? (
        <div style={{ fontSize: 12, color: admin.muted, marginTop: 6 }}>{hint}</div>
      ) : null}
    </div>
  );
}
