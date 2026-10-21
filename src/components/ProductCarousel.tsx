"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/data/products";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { ProductCard } from "./ProductCard";

export function ProductCarousel({
  title,
  products,
  locale,
  dict,
  href,
  badge,
}: {
  title: string;
  products: Product[];
  locale: Locale;
  dict: Dictionary;
  href?: string;
  badge?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    scroller.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-3 py-4 md:px-6 lg:px-10">
      <div className="mb-3 flex items-end justify-between gap-3 md:mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {href ? (
            <Link
              href={href}
              className="kh-uline kh-4d text-[18px] font-semibold text-[#222] md:text-[22px]"
            >
              {title}
            </Link>
          ) : (
            <h2 className="kh-4d text-[18px] font-semibold text-[#222] md:text-[22px]">
              {title}
            </h2>
          )}
          {badge ? (
            <span className="rounded-full bg-[#e8f8ef] px-2.5 py-0.5 text-[12px] font-semibold text-[#1a9a4a]">
              {badge}
            </span>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="kh-uline text-[13px] font-semibold text-[#ff003c]"
          >
            {dict.seeAll}
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div
          ref={scroller}
          className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => (
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
          onClick={() => scroll(1)}
          className="absolute -right-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#eee] bg-white text-xl text-[#333] shadow-md md:flex"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  );
}
