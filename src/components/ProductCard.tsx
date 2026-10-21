"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { flyToCart } from "@/lib/flyToCart";
import { useApp } from "@/context/AppContext";
import { useVideoModal } from "@/context/VideoModalContext";
import type { Product } from "@/data/products";
import { getCardSwatches } from "@/data/products";
import { formatPrice, monthlyPayment } from "@/lib/format";
import { youtubeIdForProduct } from "@/lib/productVideo";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { IconCart, IconCompare, IconHeart } from "./Icons";

/** 16 scallops traced from the reference seal: rounded tips, shallow valleys */
const SEAL_PATH = (() => {
  const cx = 50;
  const cy = 50;
  const peak = 47.2;
  const valley = 41.6;
  const teeth = 16;
  const steps = teeth * 28;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const c = Math.cos(teeth * (t + Math.PI / 2));
    const wave = Math.sign(c) * Math.abs(c) ** 0.38;
    const r = (peak + valley) / 2 + ((peak - valley) / 2) * wave;
    const x = cx + Math.cos(t) * r;
    const y = cy + Math.sin(t) * r;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
})();

function InstallmentSeal({ amount }: { amount: number }) {
  const label = String(Math.round(amount));
  const numSize =
    label.length >= 4
      ? "text-[9px]"
      : label.length === 3
        ? "text-[11px]"
        : "text-[12px]";
  return (
    <div className="relative h-[48px] w-[48px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d={SEAL_PATH} fill="#43a047" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <span className="text-[9px] font-bold leading-none">ayda</span>
        <span className={`mt-[2px] whitespace-nowrap font-extrabold leading-none ${numSize}`}>
          {label}₼
        </span>
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const { addToCart, toggleFavorite, isFavorite, toggleCompare, isCompare } =
    useApp();
  const { openVideo } = useVideoModal();
  const [toast, setToast] = useState("");
  const mediaRef = useRef<HTMLDivElement>(null);
  const fav = isFavorite(product.id);
  const cmp = isCompare(product.id);
  const monthly = monthlyPayment(product.price);
  const saved =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((product.oldPrice - product.price) * 100) / 100
      : 0;
  const discountPct =
    product.oldPrice && product.oldPrice > product.price
      ? Math.max(
          product.discount || 0,
          Math.round(
            ((product.oldPrice - product.price) / product.oldPrice) * 100
          )
        )
      : product.discount || 0;

  const showFast =
    product.category === "smartfonlar" || product.brand === "Apple";
  const showInstall =
    product.category === "ev-texnikasi" ||
    product.category === "metbex-texnikasi" ||
    /kondisioner|qabyuyan|soyuducu/i.test(product.name.az);
  const showFreeDelivery = !showFast && product.price >= 49.99;

  function handleAdd() {
    if (mediaRef.current) flyToCart(mediaRef.current, product.image);
    addToCart(product);
    setToast(dict.addedToCart);
    setTimeout(() => setToast(""), 1600);
  }

  function handleCompare() {
    const ok = toggleCompare(product.id);
    if (!ok) {
      setToast(dict.compareLimit);
      setTimeout(() => setToast(""), 2000);
    }
  }

  return (
    <article className="group kh-card kh-card-3d relative flex h-full flex-col overflow-hidden rounded-xl border border-[#e8e8e8] bg-white">
      {toast && (
        <div className="absolute left-1/2 top-2 z-30 -translate-x-1/2 rounded-full bg-[#2b2b2b] px-3 py-1 text-[11px] text-white">
          {toast}
        </div>
      )}

      <div className="kh-card-media relative px-2.5 pt-2.5">
        <div className="kh-seal-live pointer-events-none absolute left-1 top-1 z-10">
          <InstallmentSeal amount={monthly} />
        </div>

        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            className={`kh-card-action rounded-full p-1.5 shadow-sm ${fav ? "text-[#ff003c]" : "text-[#888]"}`}
            aria-label={dict.favorites}
          >
            <IconHeart className="h-4 w-4" filled={fav} />
          </button>
          <button
            type="button"
            onClick={handleCompare}
            className={`kh-card-action rounded-full p-1.5 shadow-sm ${cmp ? "text-[#ff003c]" : "text-[#888]"}`}
            aria-label={dict.compare}
          >
            <IconCompare className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              openVideo({
                youtubeId: youtubeIdForProduct(product),
                title: product.name[locale],
              })
            }
            className="kh-card-action kh-play-btn flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-[#ff003c] shadow-sm"
            title="Video"
            aria-label="Videoya bax"
          >
            ▶
          </button>
        </div>

        <Link href={`/${locale}/mehsul/${product.slug}`} className="block">
          <div ref={mediaRef} className="kh-img-shine relative mx-auto aspect-square w-full max-w-[168px]">
            <Image
              src={product.image}
              alt={product.name[locale]}
              fill
              className="kh-img-zoom object-contain p-1"
              sizes="168px"
              unoptimized
            />
          </div>
        </Link>

        <div className="mt-1 flex min-h-[22px] flex-wrap items-center gap-1">
          {discountPct ? (
            <span className="rounded-[4px] bg-[#ff003c] px-1.5 py-0.5 text-[11px] font-bold text-white">
              -{discountPct}%
            </span>
          ) : null}
          {showFast ? (
            <span className="inline-flex items-center gap-0.5 rounded-[4px] bg-[#43a047] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              2 saat/0₼
            </span>
          ) : null}
          {showInstall ? (
            <span className="rounded-[4px] bg-[#00bcd4] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              quraşdırılma 0₼
            </span>
          ) : null}
          {showFreeDelivery ? (
            <span className="inline-flex items-center gap-0.5 rounded-[4px] bg-[#43a047] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              çatdırılma 0₼
            </span>
          ) : null}
          {product.badge ? (
            <span className="text-[10px] font-semibold text-[#e91e8c]">
              {product.badge[locale]}
            </span>
          ) : null}
          {showFast ? (
            <span className="text-[10px] font-semibold text-[#e91e8c]">
              xüsusi şərtlər
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2">
        <div className="mb-1.5 flex min-h-3 gap-1">
          {getCardSwatches(product).map((swatch) => (
            <span
              key={swatch}
              className="h-3 w-3 rounded-full border border-[#ddd]"
              style={{ background: swatch }}
            />
          ))}
        </div>

        <Link href={`/${locale}/mehsul/${product.slug}`}>
          <h3 className="mb-1 line-clamp-2 min-h-[36px] text-[12px] font-medium leading-[18px] text-[#222] md:text-[13px] md:leading-5">
            {product.name[locale]}
          </h3>
        </Link>

        <div className="mb-2 flex items-center gap-1 text-[12px]">
          <span className="text-[#f5a623]">★</span>
          <span className="font-semibold text-[#333]">
            {product.rating >= 4.5 ? "5.0" : product.rating.toFixed(1)}
          </span>
          {product.reviewCount === 0 ? (
            <span className="text-[#999]">{dict.writeReview}</span>
          ) : (
            <span className="text-[#999]">({product.reviewCount})</span>
          )}
        </div>

        <div className="mt-auto">
          <div className="mb-0.5 flex min-h-[18px] flex-wrap items-center gap-1.5">
            {product.oldPrice ? (
              <span className="text-[12px] text-[#999] line-through">
                {formatPrice(product.oldPrice, locale)}
              </span>
            ) : null}
            {saved > 0 ? (
              <span className="rounded-[3px] bg-[#ffe566] px-1 py-0.5 text-[11px] font-bold text-[#222]">
                -{formatPrice(saved, locale).replace(" ₼", "")}₼
              </span>
            ) : null}
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[17px] font-bold leading-tight text-[#222] md:text-[18px]">
                {formatPrice(product.price, locale)}
              </div>
              <div className="text-[11px] font-medium text-[#2f6fed] md:text-[12px]">
                ayda {formatPrice(monthly, locale)}
                {locale === "az" ? "-dan" : ""}
              </div>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff003c] text-white transition hover:bg-[#e00035]"
              aria-label={dict.addToCart}
            >
              <IconCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
