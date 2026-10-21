"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useProductsByIds } from "@/hooks/useProductsByIds";
import { formatPrice } from "@/lib/format";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

export function CompareClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { compare, clearCompare, toggleCompare, addToCart } = useApp();
  const { items: list } = useProductsByIds(compare);

  if (!compare.length) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-16 text-center md:px-6">
        <h1 className="mb-3 text-[24px] font-bold">{dict.compare}</h1>
        <p className="mb-6 text-[#777]">{dict.emptyCompare}</p>
        <Link
          href={`/${locale}/kataloq`}
          className="inline-flex rounded-xl bg-[#e5004d] px-5 py-3 text-[14px] font-semibold text-white"
        >
          {dict.continueShopping}
        </Link>
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-16 text-center text-[#777] md:px-6">
        ...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold md:text-[28px]">{dict.compare}</h1>
        <button
          type="button"
          onClick={clearCompare}
          className="text-[13px] font-semibold text-[#e5004d]"
        >
          {dict.clearAll}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#eee] bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#eee]">
              <th className="p-4 font-semibold text-[#777]">{dict.productDetails}</th>
              {list.map((p) => (
                <th key={p.id} className="min-w-[180px] p-4 align-top">
                  <div className="relative mx-auto mb-3 h-28 w-28">
                    <Image
                      src={p.image}
                      alt={p.name[locale]}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <Link
                    href={`/${locale}/mehsul/${p.slug}`}
                    className="mb-2 block font-semibold text-[#222] hover:text-[#e5004d]"
                  >
                    {p.name[locale]}
                  </Link>
                  <div className="mb-2 text-[16px] font-bold">
                    {formatPrice(p.price, locale)}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className="rounded-lg bg-[#e5004d] px-3 py-2 text-[12px] font-semibold text-white"
                    >
                      {dict.addToCart}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(p.id)}
                      className="text-[12px] text-[#999]"
                    >
                      {dict.remove}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#eee]">
              <td className="p-4 font-semibold text-[#777]">{dict.brand}</td>
              {list.map((p) => (
                <td key={p.id} className="p-4">
                  {p.brand}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[#eee]">
              <td className="p-4 font-semibold text-[#777]">{dict.discount}</td>
              {list.map((p) => (
                <td key={p.id} className="p-4">
                  {p.discount ? `-${p.discount}%` : "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[#777]">{dict.specs}</td>
              {list.map((p) => (
                <td key={p.id} className="p-4 align-top">
                  <ul className="space-y-1">
                    {p.specs.map((s) => (
                      <li key={s.label.az}>
                        <span className="text-[#888]">{s.label[locale]}: </span>
                        {s.value[locale]}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
