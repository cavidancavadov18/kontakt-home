"use client";

import { useEffect, useState } from "react";
import { adminFetch, fmtDate } from "@/components/admin/adminFetch";
import {
  Btn,
  DataTable,
  Loading,
  PageHeader,
  Td,
  Tr,
} from "@/components/admin/DataTable";
import { admin } from "@/components/admin/adminStyles";
import { useToast } from "@/components/admin/useToast";
import type { OneClickRecord } from "@/server/db";

export default function AdminOneClickPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<OneClickRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await adminFetch<{ oneClick: OneClickRecord[] }>(
      "/api/admin/one-click"
    );
    if (res.ok) setRows(res.data.oneClick);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Lead-i silmək istəyirsiniz?")) return;
    setBusy(id);
    const res = await adminFetch(`/api/admin/one-click/${id}`, {
      method: "DELETE",
    });
    setBusy(null);
    if (!res.ok) {
      toast(res.error, "err");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast("Silindi");
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Bir klik sifarişlər"
        subtitle={`${rows.length} lead`}
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
        headers={["Ad", "Telefon", "Məhsul", "Tarix", ""]}
        empty={rows.length === 0 ? "Lead yoxdur" : undefined}
      >
        {rows.map((r) => (
          <Tr key={r.id}>
            <Td style={{ fontWeight: 600 }}>{r.name}</Td>
            <Td>{r.phone}</Td>
            <Td>
              <div>{r.productName}</div>
              <div style={{ fontSize: 11, color: admin.muted, fontFamily: "monospace" }}>
                {r.slug} · {r.productId}
              </div>
            </Td>
            <Td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
              {fmtDate(r.createdAt)}
            </Td>
            <Td>
              <Btn
                variant="danger"
                disabled={busy === r.id}
                onClick={() => remove(r.id)}
              >
                Sil
              </Btn>
            </Td>
          </Tr>
        ))}
      </DataTable>
    </div>
  );
}
