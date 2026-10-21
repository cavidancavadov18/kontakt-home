"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { brandLogos } from "@/data/brands";
import type { Locale } from "@/i18n/dictionaries";

export function BrandStrip({ locale }: { locale: Locale }) {
  const scroller = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-[1440px] px-3 py-4 md:px-6 lg:px-10">
      <div className="relative">
        <div
          ref={scroller}
          className="grid auto-cols-[minmax(120px,148px)] grid-flow-col grid-rows-2 gap-2.5 overflow-x-auto pb-1 md:auto-cols-[minmax(140px,168px)] md:gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {brandLogos.map((b) => (
            <Link
              key={b.name}
              href={`/${locale}${b.href}`}
              className="kh-brand-tile flex h-[64px] items-center justify-center rounded-2xl border border-[#ebebeb] bg-white px-3 md:h-[80px] md:px-4"
            >
              <Image
                src={b.image}
                alt={b.name}
                width={120}
                height={48}
                className="max-h-9 w-auto object-contain md:max-h-11"
                unoptimized
              />
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute -right-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#eee] bg-white text-[#333] shadow-md md:flex"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  );
}
