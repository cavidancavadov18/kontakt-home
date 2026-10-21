"use client";

import { Fragment, useEffect, useState } from "react";
import { adminFetch, fmtDate, fmtMoney } from "@/components/admin/adminFetch";
import {
  Badge,
  Btn,
  DataTable,
  Loading,
  PageHeader,
  Td,
  Tr,
} from "@/components/admin/DataTable";
import { admin } from "@/components/admin/adminStyles";
import { useToast } from "@/components/admin/useToast";
import type { Order } from "@/server/db";

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await adminFetch<{ orders: Order[] }>("/api/admin/orders");
    if (res.ok) setOrders(res.data.orders);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: "paid" | "pending") {
    setBusy(id);
    const res = await adminFetch<{ order: Order }>(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ payment: { status } }),
    });
    setBusy(null);
    if (!res.ok) {
      toast(res.error, "err");
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? res.data.order : o)));
    toast(`Ödəniş statusu: ${status}`);
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Sifarişlər"
        subtitle={`${orders.length} sifariş`}
        actions={
          <Btn
            onClick={() => {
              setLoading(true);
              load();
            }}
          >
            Yenilə
          </Btn>
        }
      />

      <DataTable
        headers={[
          "ID",
          "Müştəri",
          "Metod",
          "Ödəniş",
          "Məbləğ",
          "Tarix",
          "Əməliyyat",
        ]}
        empty={orders.length === 0 ? "Sifariş yoxdur" : undefined}
      >
        {orders.map((o) => (
          <Fragment key={o.id}>
            <Tr
              expanded={expanded === o.id}
              onClick={() =>
                setExpanded((cur) => (cur === o.id ? null : o.id))
              }
            >
              <Td style={{ fontWeight: 600, color: "#ff6b8a" }}>{o.id}</Td>
              <Td>
                <div>{o.customer.name}</div>
                <div style={{ fontSize: 11, color: admin.muted }}>{o.phone}</div>
              </Td>
              <Td>
                <Badge tone="neutral">{o.payment.method}</Badge>
                {o.payment.installmentMonths ? (
                  <span
                    style={{ marginLeft: 6, fontSize: 11, color: admin.muted }}
                  >
                    {o.payment.installmentMonths} ay
                  </span>
                ) : null}
              </Td>
              <Td>
                <Badge tone={o.payment.status === "paid" ? "ok" : "warn"}>
                  {o.payment.status}
                </Badge>
              </Td>
              <Td style={{ fontWeight: 600 }}>{fmtMoney(o.total)}</Td>
              <Td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                {fmtDate(o.createdAt)}
              </Td>
              <Td>
                <div
                  style={{ display: "flex", gap: 6 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {o.payment.status === "pending" ? (
                    <Btn
                      variant="primary"
                      disabled={busy === o.id}
                      onClick={() => setStatus(o.id, "paid")}
                    >
                      Paid
                    </Btn>
                  ) : (
                    <Btn
                      disabled={busy === o.id}
                      onClick={() => setStatus(o.id, "pending")}
                    >
                      Pending
                    </Btn>
                  )}
                </div>
              </Td>
            </Tr>
            {expanded === o.id ? (
              <tr>
                <Td colSpan={7} style={{ background: "#12151c" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      fontSize: 13,
                    }}
                  >
                    <div>
                      <strong style={{ color: admin.muted }}>Ünvan</strong>
                      <div>
                        {o.customer.city}, {o.customer.address}
                      </div>
                      {o.customer.note ? (
                        <div style={{ marginTop: 6, color: admin.muted }}>
                          Qeyd: {o.customer.note}
                        </div>
                      ) : null}
                      {o.promoCode ? (
                        <div style={{ marginTop: 6 }}>Promo: {o.promoCode}</div>
                      ) : null}
                    </div>
                    <div>
                      <strong style={{ color: admin.muted }}>Məhsullar</strong>
                      <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                        {o.items.map((it) => (
                          <li key={`${it.productId}-${it.slug}`}>
                            {it.name} × {it.qty} —{" "}
                            {fmtMoney(it.unitPrice * it.qty)}
                          </li>
                        ))}
                      </ul>
                      <div style={{ marginTop: 8, color: admin.muted }}>
                        Ara: {fmtMoney(o.subtotal)} · Endirim:{" "}
                        {fmtMoney(o.discount)} · Çatdırılma:{" "}
                        {fmtMoney(o.deliveryFee)}
                      </div>
                      {o.payment.transactionId ? (
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 11,
                            color: admin.muted,
                          }}
                        >
                          Txn: {o.payment.transactionId}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Td>
              </tr>
            ) : null}
          </Fragment>
        ))}
      </DataTable>
    </div>
  );
}
