"use client";

import {
  Children,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { admin } from "./adminStyles";

export function DataTable({
  headers,
  children,
  empty,
}: {
  headers: string[];
  children: ReactNode;
  empty?: string;
}) {
  const isEmpty = Children.count(children) === 0;
  return (
    <div
      style={{
        background: admin.panel,
        border: `1px solid ${admin.border}`,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} style={thStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {empty && isEmpty ? (
        <div
          style={{
            padding: "28px 16px",
            textAlign: "center",
            color: admin.muted,
            fontSize: 13,
          }}
        >
          {empty}
        </div>
      ) : null}
    </div>
  );
}

export function Td({
  children,
  style,
  colSpan,
}: {
  children?: ReactNode;
  style?: CSSProperties;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} style={{ ...tdStyle, ...style }}>
      {children}
    </td>
  );
}

export function Tr({
  children,
  onClick,
  expanded,
}: {
  children: ReactNode;
  onClick?: () => void;
  expanded?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : undefined,
        background: expanded ? admin.panelHover : undefined,
      }}
      onMouseEnter={(e) => {
        if (!expanded) e.currentTarget.style.background = admin.panelHover;
      }}
      onMouseLeave={(e) => {
        if (!expanded) e.currentTarget.style.background = "";
      }}
    >
      {children}
    </tr>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "ok" | "warn" | "danger" | "neutral" | "accent";
}) {
  const colors: Record<string, { bg: string; fg: string }> = {
    ok: { bg: "#14532d55", fg: "#4ade80" },
    warn: { bg: "#78350f55", fg: "#fbbf24" },
    danger: { bg: "#7f1d1d55", fg: "#f87171" },
    accent: { bg: "#ff003c22", fg: "#ff6b8a" },
    neutral: { bg: "#2a314255", fg: admin.muted },
  };
  const c = colors[tone];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        background: c.bg,
        color: c.fg,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function Btn({
  children,
  onClick,
  variant = "ghost",
  disabled,
  type = "button",
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  style?: CSSProperties;
}) {
  const base: CSSProperties = {
    border: `1px solid ${admin.border}`,
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
    ...style,
  };
  if (variant === "primary") {
    Object.assign(base, {
      background: admin.accent,
      borderColor: admin.accent,
      color: "#fff",
    });
  } else if (variant === "danger") {
    Object.assign(base, {
      background: "transparent",
      borderColor: "#7f1d1d",
      color: "#f87171",
    });
  } else {
    Object.assign(base, {
      background: "transparent",
      color: admin.text,
    });
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={base}>
      {children}
    </button>
  );
}

export function Input({
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        background: "#0f1115",
        border: `1px solid ${admin.border}`,
        borderRadius: 6,
        color: admin.text,
        padding: "8px 12px",
        fontSize: 13,
        fontFamily: "inherit",
        outline: "none",
        width: props.width ? undefined : "100%",
        ...((props.style as CSSProperties) || {}),
      }}
    />
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 20,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: admin.text,
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p style={{ margin: "4px 0 0", fontSize: 13, color: admin.muted }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

export function Loading() {
  return (
    <div style={{ color: admin.muted, fontSize: 13, padding: 24 }}>
      Yüklənir…
    </div>
  );
}

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: 11,
  fontWeight: 600,
  color: admin.muted,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: `1px solid ${admin.border}`,
  background: "#12151c",
  whiteSpace: "nowrap",
};

const tdStyle: CSSProperties = {
  padding: "10px 14px",
  borderBottom: `1px solid ${admin.border}`,
  color: admin.text,
  verticalAlign: "middle",
};
