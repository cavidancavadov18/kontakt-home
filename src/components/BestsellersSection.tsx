"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { appleSideBanner, bestsellerChips } from "@/data/homeMedia";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

export function BestsellersSection({
  locale,
  dict,
  title,
  productsByCategory,
}: {
  locale: Locale;
  dict: Dictionary;
  title: string;
  productsByCategory: Record<string, Product[]>;
}) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const chip = bestsellerChips[active];

  const list = useMemo(() => {
    const filtered = productsByCategory[chip.category] || [];
    return (
      filtered.length
        ? filtered
        : productsByCategory.smartfonlar ||
          Object.values(productsByCategory)[0] ||
          []
    ).slice(0, 16);
  }, [chip.category, productsByCategory]);

  return (
    <section className="mx-auto max-w-[1440px] px-3 py-5 md:px-6 lg:px-10">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-[#222] md:text-[22px]">
          <Link
            href={`/${locale}/kataloq/${chip.category}`}
            className="kh-uline"
          >
            {title}
          </Link>
        </h2>
        <Link
          href={`/${locale}/kataloq/${chip.category}`}
          className="kh-uline text-[13px] font-semibold text-[#ff003c]"
        >
          {dict.seeAll}
        </Link>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {bestsellerChips.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={`${c.az}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`kh-chip shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition ${
                on
                  ? "kh-chip-on bg-[#2b2b2b] text-white"
                  : "bg-white text-[#333] ring-1 ring-[#e5e5e5] hover:bg-[#f7f7f7]"
              }`}
            >
              {c[locale]}
            </button>
          );
        })}
      </div>

      <div className="relative flex gap-3 md:gap-4">
        <Link
          href={`/${locale}${appleSideBanner.href}`}
          className="kh-side-banner relative hidden w-[180px] shrink-0 self-stretch overflow-hidden rounded-2xl border border-[#ebebeb] bg-white lg:block xl:w-[220px]"
        >
          <div className="relative flex h-full min-h-[420px] items-center justify-center p-6">
            <Image
              src={appleSideBanner.image}
              alt={appleSideBanner.alt[locale]}
              width={160}
              height={200}
              className="h-auto w-full max-w-[140px] object-contain"
              unoptimized
            />
          </div>
        </Link>

        <div className="relative min-w-0 flex-1">
          <div
            ref={scroller}
            className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {list.map((p) => (
              <div
                key={p.id}
                className="w-[min(46vw,200px)] shrink-0 sm:w-[210px] md:w-[220px]"
              >
                <ProductCard product={p} locale={locale} dict={dict} />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              scroller.current?.scrollBy({ left: 280, behavior: "smooth" })
            }
            className="absolute -right-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#eee] bg-white text-xl text-[#333] shadow-md md:flex"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
