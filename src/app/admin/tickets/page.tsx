"use client";

import { useEffect, useState } from "react";
import { adminFetch, fmtDate } from "@/components/admin/adminFetch";
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
import type { Ticket } from "@/types/api";

export default function AdminTicketsPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await adminFetch<{ tickets: Ticket[] }>("/api/admin/tickets");
    if (res.ok) setTickets(res.data.tickets);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: "open" | "closed") {
    setBusy(id);
    const res = await adminFetch<{ ticket: Ticket }>(
      `/api/admin/tickets/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
    setBusy(null);
    if (!res.ok) {
      toast(res.error, "err");
      return;
    }
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? res.data.ticket : t))
    );
    toast(`Ticket: ${status}`);
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Ticketlər"
        subtitle={`${tickets.filter((t) => t.status === "open").length} açıq / ${tickets.length} cəmi`}
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
        headers={["Status", "Telefon", "Mesaj", "Tarix", ""]}
        empty={tickets.length === 0 ? "Ticket yoxdur" : undefined}
      >
        {tickets.map((t) => (
          <Tr key={t.id}>
            <Td>
              <Badge tone={t.status === "open" ? "warn" : "ok"}>
                {t.status}
              </Badge>
            </Td>
            <Td>{t.phone || "—"}</Td>
            <Td style={{ maxWidth: 400, color: admin.text }}>
              <div style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
                {t.message}
              </div>
            </Td>
            <Td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
              {fmtDate(t.createdAt)}
            </Td>
            <Td>
              {t.status === "open" ? (
                <Btn
                  variant="primary"
                  disabled={busy === t.id}
                  onClick={() => setStatus(t.id, "closed")}
                >
                  Bağla
                </Btn>
              ) : (
                <Btn
                  disabled={busy === t.id}
                  onClick={() => setStatus(t.id, "open")}
                >
                  Aç
                </Btn>
              )}
            </Td>
          </Tr>
        ))}
      </DataTable>
    </div>
  );
}
