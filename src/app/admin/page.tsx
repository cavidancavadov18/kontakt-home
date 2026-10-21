"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch, fmtDate, fmtMoney } from "@/components/admin/adminFetch";
import {
  Badge,
  DataTable,
  Loading,
  PageHeader,
  Td,
  Tr,
} from "@/components/admin/DataTable";
import { StatCard } from "@/components/admin/StatCard";
import type { Order } from "@/server/db";

type Stats = {
  orders: number;
  users: number;
  openTickets: number;
  oneClick: number;
  reviews: number;
  pendingPayments: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [s, o] = await Promise.all([
        adminFetch<Stats>("/api/admin/stats"),
        adminFetch<{ orders: Order[] }>("/api/admin/orders"),
      ]);
      if (cancelled) return;
      if (s.ok) setStats(s.data);
      if (o.ok) setOrders(o.data.orders.slice(0, 8));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Ümumi statistikalar və son sifarişlər"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <StatCard label="Sifarişlər" value={stats?.orders ?? 0} />
        <StatCard label="İstifadəçilər" value={stats?.users ?? 0} />
        <StatCard label="Açıq ticket" value={stats?.openTickets ?? 0} />
        <StatCard label="Bir klik" value={stats?.oneClick ?? 0} />
        <StatCard label="Rəylər" value={stats?.reviews ?? 0} />
        <StatCard
          label="Gözləyən ödəniş"
          value={stats?.pendingPayments ?? 0}
          hint="Pending payments"
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
          Son sifarişlər
        </h2>
        <Link
          href="/admin/orders"
          style={{ fontSize: 13, color: "#ff6b8a", textDecoration: "none" }}
        >
          Hamısı →
        </Link>
      </div>

      <DataTable
        headers={["ID", "Müştəri", "Məbləğ", "Ödəniş", "Tarix"]}
        empty={orders.length === 0 ? "Sifariş yoxdur" : undefined}
      >
        {orders.map((o) => (
          <Tr key={o.id}>
            <Td>
              <Link
                href="/admin/orders"
                style={{ color: "#ff6b8a", textDecoration: "none", fontWeight: 600 }}
              >
                {o.id}
              </Link>
            </Td>
            <Td>
              <div>{o.customer.name}</div>
              <div style={{ fontSize: 11, color: "#8b93a7" }}>{o.phone}</div>
            </Td>
            <Td>{fmtMoney(o.total)}</Td>
            <Td>
              <Badge tone={o.payment.status === "paid" ? "ok" : "warn"}>
                {o.payment.status}
              </Badge>
            </Td>
            <Td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
              {fmtDate(o.createdAt)}
            </Td>
          </Tr>
        ))}
      </DataTable>
    </div>
  );
}
