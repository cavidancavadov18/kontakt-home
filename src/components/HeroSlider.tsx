"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@/data/banners";
import type { Locale } from "@/i18n/dictionaries";
import { PopularBlocks } from "./PopularBlocks";

export function HeroSlider({
  banners,
  locale,
}: {
  banners: Banner[];
  locale: Locale;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + banners.length) % banners.length);
    },
    [banners.length]
  );

  useEffect(() => {
    if (paused || banners.length < 2) return;
    const id = setInterval(() => go(1), 5200);
    return () => clearInterval(id);
  }, [paused, banners.length, go]);

  return (
    <section
      className="relative bg-[#f3f3f3]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Mobile */}
      <div className="relative mx-auto aspect-[1024/434] w-full max-w-[1440px] overflow-hidden md:hidden">
        {banners.map((b, i) => (
          <Link
            key={b.id}
            href={`/${locale}${b.href}`}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              i === index
                ? "z-[1] scale-100 opacity-100"
                : "z-0 scale-[1.04] opacity-0"
            }`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <Image
              src={b.mobile[locale] ?? b.mobile.az}
              alt={b.alt[locale]}
              fill
              priority={i === 0}
              className="object-cover object-center"
              sizes="100vw"
              unoptimized
            />
          </Link>
        ))}
      </div>

      {/* Desktop — fixed 600px like live kontakt.az */}
      <div className="relative mx-auto hidden h-[600px] w-full max-w-[1920px] overflow-hidden md:block">
        {banners.map((b, i) => (
          <Link
            key={b.id}
            href={`/${locale}${b.href}`}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              i === index
                ? "z-[1] scale-100 opacity-100"
                : "z-0 scale-[1.04] opacity-0"
            }`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <Image
              src={b.desktop[locale] ?? b.desktop.az}
              alt={b.alt[locale]}
              fill
              priority={i === 0}
              className={`object-cover object-center transition-transform duration-[6500ms] ease-out ${
                i === index ? "kh-hero-kenburns scale-100" : "scale-[1.06]"
              }`}
              sizes="100vw"
              unoptimized
            />
          </Link>
        ))}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[48%] bg-gradient-to-t from-[#f3f3f3]/95 via-[#f3f3f3]/40 to-transparent"
          aria-hidden
        />

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="absolute left-4 top-[28%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#333] shadow-[0_2px_12px_rgba(0,0,0,0.14)] transition hover:scale-110 hover:bg-white lg:left-8"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15.5 4.5 8.5 12l7 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(1)}
          className="absolute right-4 top-[28%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#333] shadow-[0_2px_12px_rgba(0,0,0,0.14)] transition hover:scale-110 hover:bg-white lg:right-8"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="m8.5 4.5 7 7.5-7 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="pointer-events-none absolute inset-x-0 top-[30%] z-20 flex justify-center">
          <div className="pointer-events-auto flex gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={b.alt[locale]}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-5 bg-[#ff003c]"
                    : "w-2 bg-black/25 hover:bg-black/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 pb-5">
          <PopularBlocks locale={locale} overlay />
        </div>
      </div>

      {/* Mobile dots */}
      <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 md:hidden">
        {banners.map((b, i) => (
          <button
            key={b.id}
            type="button"
            aria-label={b.alt[locale]}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-[#ff003c]" : "w-2 bg-black/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
