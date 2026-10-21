"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { adminFetch, fmtMoney } from "@/components/admin/adminFetch";
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

type ProductRow = {
  id: string;
  slug: string;
  name: { az: string; ru: string };
  brand: string;
  category: string;
  price: number;
  image: string;
  sku?: string;
};

type ProductsRes = {
  items: ProductRow[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export default function AdminProductsPage() {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductsRes | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (search: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({
      q: search,
      page: String(p),
      limit: "20",
    });
    const res = await adminFetch<ProductsRes>(
      `/api/admin/products?${params}`
    );
    if (res.ok) setData(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(query, page);
  }, [load, query, page]);

  function search(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(q.trim());
  }

  return (
    <div>
      <PageHeader
        title="Məhsullar"
        subtitle={
          data
            ? `${data.total} nəticə · səhifə ${data.page}/${data.pages}`
            : "Kataloq axtarışı"
        }
      />

      <form
        onSubmit={search}
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 240px", maxWidth: 420 }}>
          <Input
            placeholder="Ad, slug, brand, id, sku…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Btn type="submit" variant="primary">
          Axtar
        </Btn>
      </form>

      {loading && !data ? (
        <Loading />
      ) : (
        <>
          <DataTable
            headers={["Şəkil", "Ad", "Brand", "Qiymət", "ID / Slug"]}
            empty={
              !data?.items.length ? "Məhsul tapılmadı" : undefined
            }
          >
            {(data?.items || []).map((p) => (
              <Tr key={p.id}>
                <Td style={{ width: 56 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt=""
                    width={40}
                    height={40}
                    style={{
                      objectFit: "contain",
                      borderRadius: 4,
                      background: "#0f1115",
                    }}
                  />
                </Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{p.name.az}</div>
                  <div style={{ fontSize: 11, color: admin.muted }}>
                    {p.category}
                  </div>
                </Td>
                <Td>{p.brand}</Td>
                <Td style={{ fontWeight: 600 }}>{fmtMoney(p.price)}</Td>
                <Td style={{ fontSize: 11, fontFamily: "monospace", color: admin.muted }}>
                  <div>{p.id}</div>
                  <div>{p.slug}</div>
                  {p.sku ? <div>SKU: {p.sku}</div> : null}
                </Td>
              </Tr>
            ))}
          </DataTable>

          {data && data.pages > 1 ? (
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginTop: 16,
                justifyContent: "center",
              }}
            >
              <Btn
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Əvvəlki
              </Btn>
              <span style={{ fontSize: 13, color: admin.muted }}>
                {page} / {data.pages}
              </span>
              <Btn
                disabled={page >= data.pages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Növbəti →
              </Btn>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
