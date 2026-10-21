"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { adminFetch } from "@/components/admin/adminFetch";
import {
  Btn,
  DataTable,
  Input,
  Loading,
  PageHeader,
  Td,
  Tr,
} from "@/components/admin/DataTable";
import { admin } from "@/components/admin/adminStyles";
import { useToast } from "@/components/admin/useToast";
import type { StockEntry } from "@/server/db";

type EditRow = { qty: string; reserved: string };

export default function AdminStockPage() {
  const { toast } = useToast();
  const [stock, setStock] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [edits, setEdits] = useState<Record<string, EditRow>>({});
  const [newId, setNewId] = useState("");
  const [newQty, setNewQty] = useState("10");
  const [newReserved, setNewReserved] = useState("0");
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await adminFetch<{ stock: StockEntry[] }>("/api/admin/stock");
    if (res.ok) {
      setStock(res.data.stock);
      const map: Record<string, EditRow> = {};
      for (const s of res.data.stock) {
        map[s.productId] = {
          qty: String(s.qty),
          reserved: String(s.reserved),
        };
      }
      setEdits(map);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stock;
    return stock.filter((s) => s.productId.toLowerCase().includes(q));
  }, [stock, query]);

  async function save(productId: string, qty: number, reserved: number) {
    setBusy(productId);
    const res = await adminFetch<{ entry: StockEntry }>("/api/admin/stock", {
      method: "PATCH",
      body: JSON.stringify({ productId, qty, reserved }),
    });
    setBusy(null);
    if (!res.ok) {
      toast(res.error, "err");
      return;
    }
    setStock((prev) => {
      const idx = prev.findIndex((s) => s.productId === productId);
      if (idx < 0) return [...prev, res.data.entry];
      const next = [...prev];
      next[idx] = res.data.entry;
      return next;
    });
    setEdits((prev) => ({
      ...prev,
      [productId]: {
        qty: String(res.data.entry.qty),
        reserved: String(res.data.entry.reserved),
      },
    }));
    toast("Stok yeniləndi");
  }

  async function saveRow(productId: string) {
    const e = edits[productId];
    if (!e) return;
    await save(productId, Number(e.qty), Number(e.reserved));
  }

  async function addOverride() {
    const productId = newId.trim();
    if (!productId) {
      toast("productId daxil edin", "err");
      return;
    }
    await save(productId, Number(newQty), Number(newReserved));
    setNewId("");
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Stok"
        subtitle="Override siyahısı — qty / reserved"
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

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ flex: "1 1 200px", maxWidth: 320 }}>
          <Input
            placeholder="productId axtar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          background: admin.panel,
          border: `1px solid ${admin.border}`,
          borderRadius: 10,
          padding: 14,
          marginBottom: 16,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: "1 1 180px" }}>
          <label style={labelStyle}>Yeni productId</label>
          <Input
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="məs. prod-123"
          />
        </div>
        <div style={{ width: 100 }}>
          <label style={labelStyle}>Qty</label>
          <Input
            type="number"
            min={0}
            value={newQty}
            onChange={(e) => setNewQty(e.target.value)}
          />
        </div>
        <div style={{ width: 100 }}>
          <label style={labelStyle}>Reserved</label>
          <Input
            type="number"
            min={0}
            value={newReserved}
            onChange={(e) => setNewReserved(e.target.value)}
          />
        </div>
        <Btn variant="primary" disabled={!!busy} onClick={addOverride}>
          Əlavə et / saxla
        </Btn>
      </div>

      <DataTable
        headers={["Product ID", "Qty", "Reserved", "Available", ""]}
        empty={filtered.length === 0 ? "Override yoxdur" : undefined}
      >
        {filtered.map((s) => {
          const e = edits[s.productId] || {
            qty: String(s.qty),
            reserved: String(s.reserved),
          };
          const avail = Math.max(0, Number(e.qty) - Number(e.reserved));
          return (
            <Tr key={s.productId}>
              <Td style={{ fontFamily: "monospace", fontSize: 12 }}>
                {s.productId}
              </Td>
              <Td style={{ width: 110 }}>
                <Input
                  type="number"
                  min={0}
                  value={e.qty}
                  onChange={(ev) =>
                    setEdits((prev) => ({
                      ...prev,
                      [s.productId]: { ...e, qty: ev.target.value },
                    }))
                  }
                />
              </Td>
              <Td style={{ width: 110 }}>
                <Input
                  type="number"
                  min={0}
                  value={e.reserved}
                  onChange={(ev) =>
                    setEdits((prev) => ({
                      ...prev,
                      [s.productId]: { ...e, reserved: ev.target.value },
                    }))
                  }
                />
              </Td>
              <Td>{Number.isFinite(avail) ? avail : "—"}</Td>
              <Td>
                <Btn
                  variant="primary"
                  disabled={busy === s.productId}
                  onClick={() => saveRow(s.productId)}
                >
                  Saxla
                </Btn>
              </Td>
            </Tr>
          );
        })}
      </DataTable>
    </div>
  );
}

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: admin.muted,
  marginBottom: 4,
};
