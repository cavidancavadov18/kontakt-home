"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useProductsByIds } from "@/hooks/useProductsByIds";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { ProductCard } from "./ProductCard";

export function FavoritesClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { favorites } = useApp();
  const { items: list, loading } = useProductsByIds(favorites);

  if (!favorites.length) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-16 text-center md:px-6">
        <h1 className="mb-3 text-[24px] font-bold">{dict.favorites}</h1>
        <p className="mb-6 text-[#777]">{dict.emptyFavorites}</p>
        <Link
          href={`/${locale}/kataloq`}
          className="inline-flex rounded-xl bg-[#e5004d] px-5 py-3 text-[14px] font-semibold text-white"
        >
          {dict.continueShopping}
        </Link>
      </div>
    );
  }

  if (loading && list.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-16 text-center text-[#777] md:px-6">
        ...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
      <h1 className="mb-5 text-[22px] font-bold md:text-[28px]">{dict.favorites}</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
        ))}
      </div>
    </div>
  );
}
