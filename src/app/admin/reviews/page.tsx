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
import type { Review } from "@/server/db";

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await adminFetch<{ reviews: Review[] }>("/api/admin/reviews");
    if (res.ok) setReviews(res.data.reviews);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Rəyi silmək istəyirsiniz?")) return;
    setBusy(id);
    const res = await adminFetch(`/api/admin/reviews/${id}`, {
      method: "DELETE",
    });
    setBusy(null);
    if (!res.ok) {
      toast(res.error, "err");
      return;
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast("Rəy silindi");
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Rəylər"
        subtitle={`${reviews.length} rəy`}
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
        headers={["Slug", "Müəllif", "Reytinq", "Mətn", "Tarix", ""]}
        empty={reviews.length === 0 ? "Rəy yoxdur" : undefined}
      >
        {reviews.map((r) => (
          <Tr key={r.id}>
            <Td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.slug}</Td>
            <Td>{r.author}</Td>
            <Td>
              <Badge tone="accent">{r.rating}/5</Badge>
            </Td>
            <Td style={{ maxWidth: 320, color: admin.muted }}>
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={r.text}
              >
                {r.text}
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
