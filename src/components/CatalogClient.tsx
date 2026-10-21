"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 24;

type SortKey = "popular" | "cheap" | "expensive";

type SpecFilterGroup = {
  key: string;
  label: { az: string; ru: string };
  options: { value: string; label: { az: string; ru: string } }[];
};

function getSpecFilterGroups(products: Product[]): SpecFilterGroup[] {
  const byLabel = new Map<
    string,
    { label: { az: string; ru: string }; values: Map<string, { az: string; ru: string }> }
  >();

  for (const p of products) {
    for (const s of p.specs) {
      const key = s.label.az;
      if (!key) continue;
      if (!byLabel.has(key)) {
        byLabel.set(key, { label: s.label, values: new Map() });
      }
      byLabel.get(key)!.values.set(s.value.az, s.value);
    }
  }

  return [...byLabel.entries()]
    .filter(([, g]) => g.values.size >= 2 && g.values.size <= 18)
    .sort((a, b) => b[1].values.size - a[1].values.size)
    .slice(0, 3)
    .map(([key, g]) => ({
      key,
      label: g.label,
      options: [...g.values.values()]
        .sort((a, b) => a.az.localeCompare(b.az, "az"))
        .slice(0, 15)
        .map((value) => ({ value: value.az, label: value })),
    }));
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export function CatalogClient({
  products,
  locale,
  dict,
  title,
  categorySlug,
}: {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
  title: string;
  categorySlug?: string;
}) {
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(() => new Set());
  const [specFilters, setSpecFilters] = useState<Record<string, Set<string>>>({});
  const [sort, setSort] = useState<SortKey>("popular");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const availableBrands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );

  const specGroups = useMemo(() => getSpecFilterGroups(products), [products]);

  const showBrandChips =
    categorySlug === "smartfonlar" ||
    categorySlug === "apple" ||
    (availableBrands.length > 1 && availableBrands.length <= 14);

  const filterSignature = useMemo(
    () =>
      [
        [...selectedBrands].sort().join("\0"),
        sort,
        minPrice,
        maxPrice,
        ...Object.entries(specFilters)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}:${[...v].sort().join(",")}`),
      ].join("|"),
    [selectedBrands, sort, minPrice, maxPrice, specFilters]
  );

  useEffect(() => {
    setPage(1);
  }, [filterSignature, products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedBrands.size > 0) {
      list = list.filter((p) => selectedBrands.has(p.brand));
    }
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    list = list.filter((p) => p.price >= min && p.price <= max);

    for (const group of specGroups) {
      const chosen = specFilters[group.key];
      if (!chosen?.size) continue;
      list = list.filter((p) =>
        p.specs.some((s) => s.label.az === group.key && chosen.has(s.value.az))
      );
    }

    if (sort === "cheap") list.sort((a, b) => a.price - b.price);
    if (sort === "expensive") list.sort((a, b) => b.price - a.price);
    if (sort === "popular") list.sort((a, b) => b.reviewCount - a.reviewCount);
    return list;
  }, [products, selectedBrands, sort, minPrice, maxPrice, specFilters, specGroups]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  };

  const toggleSpec = (specKey: string, value: string) => {
    setSpecFilters((prev) => {
      const next = { ...prev };
      const set = new Set(next[specKey] ?? []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      if (set.size === 0) delete next[specKey];
      else next[specKey] = set;
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedBrands(new Set());
    setSpecFilters({});
    setMinPrice("");
    setMaxPrice("");
    setSort("popular");
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-[#222] md:text-[28px]">{title}</h1>
          <p className="text-[13px] text-[#777]">
            {filtered.length} {dict.results}
            {totalPages > 1 ? (
              <span className="text-[#aaa]">
                {" "}
                · {dict.pageOf} {safePage}/{totalPages}
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl border border-[#ddd] bg-white px-3 py-2 text-[13px] font-semibold md:hidden"
          >
            {dict.filters}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-[#ddd] bg-white px-3 py-2 text-[13px]"
          >
            <option value="popular">{dict.sortPopular}</option>
            <option value="cheap">{dict.sortCheap}</option>
            <option value="expensive">{dict.sortExpensive}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[240px_1fr]">
        <aside
          className={`rounded-2xl border border-[#eee] bg-white p-4 ${
            open ? "block" : "hidden md:block"
          }`}
        >
          <h2 className="mb-3 text-[15px] font-bold">{dict.filters}</h2>
          <div className="mb-4">
            <div className="mb-2 text-[13px] font-semibold">{dict.brand}</div>
            <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
              {availableBrands.map((b) => (
                <label key={b} className="flex cursor-pointer items-center gap-2 text-[13px]">
                  <input
                    type="checkbox"
                    checked={selectedBrands.has(b)}
                    onChange={() => toggleBrand(b)}
                  />
                  {b}
                </label>
              ))}
            </div>
            {selectedBrands.size > 0 ? (
              <button
                type="button"
                onClick={() => setSelectedBrands(new Set())}
                className="mt-2 text-[12px] font-semibold text-[#ff003c]"
              >
                {dict.allBrands}
              </button>
            ) : null}
          </div>
          <div className="mb-4">
            <div className="mb-2 text-[13px] font-semibold">{dict.price}</div>
            <div className="flex gap-2">
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder={dict.priceMin}
                type="number"
                min={0}
                className="w-full rounded-lg border border-[#ddd] px-2 py-1.5 text-[13px]"
              />
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={dict.priceMax}
                type="number"
                min={0}
                className="w-full rounded-lg border border-[#ddd] px-2 py-1.5 text-[13px]"
              />
            </div>
          </div>
          {specGroups.map((group) => (
            <div key={group.key} className="mb-4">
              <div className="mb-2 text-[13px] font-semibold">{group.label[locale]}</div>
              <div className="flex max-h-36 flex-col gap-1.5 overflow-y-auto">
                {group.options.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-2 text-[13px]"
                  >
                    <input
                      type="checkbox"
                      checked={specFilters[group.key]?.has(opt.value) ?? false}
                      onChange={() => toggleSpec(group.key, opt.value)}
                    />
                    <span className="line-clamp-2">{opt.label[locale]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-xl border border-[#ddd] py-2 text-[13px] font-semibold"
          >
            {dict.clearAll}
          </button>
        </aside>

        <div>
          {showBrandChips && availableBrands.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {availableBrands.slice(0, 16).map((b) => {
                const active = selectedBrands.has(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBrand(b)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                      active
                        ? "border-[#ff003c] bg-[#ff003c]/5 text-[#ff003c]"
                        : "border-[#ddd] bg-white text-[#444] hover:border-[#ff003c]/40"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
              {selectedBrands.size > 0 ? (
                <button
                  type="button"
                  onClick={() => setSelectedBrands(new Set())}
                  className="rounded-full border border-dashed border-[#ccc] px-3 py-1.5 text-[12px] font-semibold text-[#777]"
                >
                  {dict.allBrands}
                </button>
              ) : null}
            </div>
          ) : null}

          {products.length === 0 ? (
            <div className="rounded-2xl border border-[#eee] bg-white p-10 text-center text-[#777]">
              {dict.emptyCategory}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-[#eee] bg-white p-10 text-center text-[#777]">
              {dict.noResults}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {paginated.map((p) => (
                  <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
                ))}
              </div>
              {totalPages > 1 ? (
                <nav
                  className="mt-6 flex flex-wrap items-center justify-center gap-1.5"
                  aria-label="Pagination"
                >
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl border border-[#ddd] bg-white px-3 py-2 text-[13px] font-semibold disabled:opacity-40"
                  >
                    {dict.prevPage}
                  </button>
                  {pageNumbers(safePage, totalPages).map((n, i) =>
                    n === "…" ? (
                      <span key={`e-${i}`} className="px-1 text-[13px] text-[#aaa]">
                        …
                      </span>
                    ) : (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={`min-w-[36px] rounded-xl border px-2 py-2 text-[13px] font-semibold ${
                          n === safePage
                            ? "border-[#ff003c] bg-[#ff003c] text-white"
                            : "border-[#ddd] bg-white"
                        }`}
                      >
                        {n}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-xl border border-[#ddd] bg-white px-3 py-2 text-[13px] font-semibold disabled:opacity-40"
                  >
                    {dict.nextPage}
                  </button>
                </nav>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
