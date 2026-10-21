"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { flyToCart } from "@/lib/flyToCart";
import { useApp } from "@/context/AppContext";
import { useVideoModal } from "@/context/VideoModalContext";
import type { Product } from "@/data/products";
import { formatPrice, monthlyPayment } from "@/lib/format";
import { apiGet, apiPost } from "@/lib/api";
import {
  loadProductReviews,
  persistProductReviews,
  type ProductReview,
} from "@/lib/productReviews";
import type { Review } from "@/server/db";
import { youtubeIdForProduct } from "@/lib/productVideo";
import {
  getColorOptions,
  getMemoryOptions,
  type MemoryOption,
} from "@/lib/productVariants";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { IconCompare, IconHeart, IconMinus, IconPlus } from "./Icons";
import { OneClickBuyModal } from "./OneClickBuyModal";
import { ProductCard } from "./ProductCard";

function formatReviewDate(iso: string, locale: Locale) {
  try {
    return new Date(iso).toLocaleDateString(locale === "az" ? "az-Latn" : "ru-RU");
  } catch {
    return iso;
  }
}

export function ProductDetailClient({
  product,
  related,
  locale,
  dict,
}: {
  product: Product;
  related: Product[];
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const galleryRef = useRef<HTMLDivElement>(null);
  const { addToCart, toggleFavorite, isFavorite, toggleCompare, isCompare } =
    useApp();
  const { openVideo } = useVideoModal();

  const colorOptions = useMemo(() => getColorOptions(product), [product]);
  const memoryOptions = useMemo(() => getMemoryOptions(product), [product]);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(product.images[0] ?? product.image);
  const [activeColorId, setActiveColorId] = useState(colorOptions[0]?.id ?? "");
  const [activeMemory, setActiveMemory] = useState<MemoryOption | null>(
    memoryOptions[0] ?? null
  );
  const [msg, setMsg] = useState("");
  const [oneClickOpen, setOneClickOpen] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [stockQty, setStockQty] = useState<number | null>(null);
  const [stockStores, setStockStores] = useState<
    { id: string; name: string; qty: number }[]
  >([]);

  function mapReview(r: Review): ProductReview {
    return {
      id: r.id,
      author: r.author,
      rating: r.rating,
      text: r.text,
      date: r.createdAt,
    };
  }

  useEffect(() => {
    let cancelled = false;
    const fallback = loadProductReviews(product, locale);
    setReviews(fallback);

    (async () => {
      try {
        const data = await apiGet<{ reviews: Review[] }>(
          `/api/reviews/${encodeURIComponent(product.slug)}`
        );
        if (cancelled) return;
        if (data.reviews?.length) {
          setReviews(data.reviews.map(mapReview));
        }
      } catch {
        /* keep local seed / cache */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [product, locale]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet<{
          qty: number;
          stores: { id: string; name: string; qty: number }[];
        }>(`/api/stock/${encodeURIComponent(product.id)}`);
        if (!cancelled) {
          setStockQty(data.qty);
          setStockStores(data.stores ?? []);
        }
      } catch {
        if (!cancelled) {
          setStockQty(null);
          setStockStores([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  useEffect(() => {
    if (colorOptions[0]) {
      setActiveColorId(colorOptions[0].id);
      setActiveImg(colorOptions[0].image);
    } else {
      setActiveImg(product.images[0] ?? product.image);
    }
    setActiveMemory(memoryOptions[0] ?? null);
  }, [product.id, colorOptions, memoryOptions, product.image, product.images]);

  const fav = isFavorite(product.id);
  const cmp = isCompare(product.id);
  const priceDelta = activeMemory?.priceDelta ?? 0;
  const displayPrice = product.price + priceDelta;
  const monthly = monthlyPayment(displayPrice);

  const reviewsTitle = locale === "az" ? "Rəylər" : "Отзывы";
  const colorLabel = locale === "az" ? "Rəng" : "Цвет";
  const memoryLabel = locale === "az" ? "Yaddaş" : "Память";
  const watchVideo = locale === "az" ? "Məhsul videosu" : "Видео о товаре";
  const oneClickLabel = locale === "az" ? "1 kliklə al" : "Купить в 1 клик";
  const reviewSuccess =
    locale === "az" ? "Rəyiniz əlavə olundu" : "Отзыв добавлен";
  const oneClickSuccess =
    locale === "az"
      ? "Sifariş qeydə alındı, operator zəng edəcək"
      : "Заказ принят, оператор свяжется с вами";

  function showToast(text: string, ms = 2000) {
    setMsg(text);
    setTimeout(() => setMsg(""), ms);
  }

  function selectColor(id: string) {
    const opt = colorOptions.find((c) => c.id === id);
    if (!opt) return;
    setActiveColorId(id);
    setActiveImg(opt.image);
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    const author = reviewAuthor.trim();
    const text = reviewText.trim();
    if (author.length < 2 || text.length < 8) return;

    try {
      const data = await apiPost<{ review: Review }>(
        `/api/reviews/${encodeURIComponent(product.slug)}`,
        { author, rating: reviewRating, text }
      );
      const entry = mapReview(data.review);
      const next = [entry, ...reviews];
      setReviews(next);
      persistProductReviews(product.slug, next);
    } catch {
      const entry: ProductReview = {
        id: `user-${Date.now()}`,
        author,
        rating: reviewRating,
        text,
        date: new Date().toISOString(),
      };
      const next = [entry, ...reviews];
      persistProductReviews(product.slug, next);
      setReviews(next);
    }

    setReviewAuthor("");
    setReviewText("");
    setReviewRating(5);
    showToast(reviewSuccess);
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
      {msg ? (
        <div className="fixed left-1/2 top-20 z-[90] -translate-x-1/2 rounded-full bg-[#2b2b2b] px-4 py-2 text-[13px] font-medium text-white shadow-lg">
          {msg}
        </div>
      ) : null}

      <Link
        href={`/${locale}/kataloq/${product.category}`}
        className="mb-4 inline-block text-[13px] font-semibold text-[#e5004d]"
      >
        ← {dict.back}
      </Link>

      <div className="grid gap-6 rounded-2xl border border-[#eee] bg-white p-4 md:grid-cols-2 md:p-6">
        <div>
          <div
            ref={galleryRef}
            className="relative mx-auto mb-4 aspect-square w-full max-w-md"
          >
            <Image
              src={activeImg}
              alt={product.name[locale]}
              fill
              className="object-contain"
              sizes="400px"
              unoptimized
              priority
            />
            <button
              type="button"
              onClick={() =>
                openVideo({
                  youtubeId: youtubeIdForProduct(product),
                  title: product.name[locale],
                })
              }
              className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[12px] font-semibold text-[#e5004d] shadow-md hover:bg-white"
              aria-label={watchVideo}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff3f7] text-[11px]">
                ▶
              </span>
              {watchVideo}
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="flex justify-center gap-2">
              {product.images.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => {
                    setActiveImg(img);
                    const match = colorOptions.find((c) => c.image === img);
                    if (match) setActiveColorId(match.id);
                  }}
                  className={`relative h-16 w-16 overflow-hidden rounded-xl border ${
                    activeImg === img ? "border-[#e5004d]" : "border-[#eee]"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {product.discount ? (
              <span className="rounded-md bg-[#e5004d] px-2 py-0.5 text-[12px] font-bold text-white">
                -{product.discount}%
              </span>
            ) : null}
            {product.badge ? (
              <span className="rounded-md bg-[#fff3f7] px-2 py-0.5 text-[12px] font-semibold text-[#e5004d]">
                {product.badge[locale]}
              </span>
            ) : null}
          </div>
          <h1 className="mb-2 text-[22px] font-bold leading-snug text-[#222] md:text-[28px]">
            {product.name[locale]}
          </h1>
          <div className="mb-4 flex items-center gap-2 text-[13px] text-[#777]">
            <span className="text-[#f5a623]">★ {product.rating.toFixed(1)}</span>
            <span>·</span>
            <span>
              {product.reviewCount + reviews.filter((r) => r.id.startsWith("user-")).length}{" "}
              {locale === "az" ? "rəy" : "отзывов"}
            </span>
            <span>·</span>
            <span
              className={`font-semibold ${
                stockQty !== null && stockQty < 1
                  ? "text-[#c40042]"
                  : "text-[#1a9a4a]"
              }`}
            >
              {stockQty !== null && stockQty < 1
                ? locale === "az"
                  ? "Stokda yoxdur"
                  : "Нет в наличии"
                : stockQty !== null
                  ? `${locale === "az" ? "Stokda" : "В наличии"}: ${stockQty} ${locale === "az" ? "ədəd" : "шт."}`
                  : dict.inStock}
            </span>
          </div>
          {stockStores.length > 0 ? (
            <p className="mb-4 text-[12px] leading-relaxed text-[#777]">
              {locale === "az" ? "Mağazalar:" : "Магазины:"}{" "}
              {stockStores
                .filter((s) => s.qty > 0)
                .slice(0, 3)
                .map((s) => `${s.name} (${s.qty})`)
                .join(" · ") ||
                (locale === "az" ? "yalnız onlayn" : "только онлайн")}
            </p>
          ) : null}

          {colorOptions.length > 0 ? (
            <div className="mb-4">
              <div className="mb-2 text-[13px] font-semibold text-[#444]">{colorLabel}</div>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectColor(c.id)}
                    title={c.label[locale]}
                    className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-[12px] font-medium ${
                      activeColorId === c.id
                        ? "border-[#e5004d] text-[#e5004d]"
                        : "border-[#ddd] text-[#555]"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{ backgroundColor: c.swatch }}
                    />
                    {c.label[locale]}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {memoryOptions.length > 0 && activeMemory ? (
            <div className="mb-4">
              <div className="mb-2 text-[13px] font-semibold text-[#444]">{memoryLabel}</div>
              <div className="flex flex-wrap gap-2">
                {memoryOptions.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMemory(m)}
                    className={`rounded-xl border px-3 py-2 text-[13px] font-semibold ${
                      activeMemory.id === m.id
                        ? "border-[#e5004d] bg-[#fff3f7] text-[#e5004d]"
                        : "border-[#ddd] text-[#444]"
                    }`}
                  >
                    <span>{m.label}</span>
                    {m.priceDelta !== 0 ? (
                      <span className="ml-1 text-[11px] font-medium text-[#777]">
                        {m.priceDelta > 0 ? "+" : ""}
                        {formatPrice(m.priceDelta, locale)}
                      </span>
                    ) : (
                      <span className="ml-1 text-[11px] font-medium text-[#1a9a4a]">
                        {locale === "az" ? "əsas" : "базовая"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {product.oldPrice ? (
            <div className="text-[14px] text-[#999] line-through">
              {formatPrice(product.oldPrice + priceDelta, locale)}
            </div>
          ) : null}
          <div className="mb-1 text-[30px] font-extrabold text-[#222]">
            {formatPrice(displayPrice, locale)}
          </div>
          <div className="mb-5 text-[14px] text-[#666]">
            {dict.installment}: {dict.monthlyFrom} {formatPrice(monthly, locale)} / 18{" "}
            {dict.months}
          </div>

          <p className="mb-5 text-[14px] leading-relaxed text-[#555]">
            {product.description[locale]}
          </p>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-[13px] font-semibold">{dict.quantity}</span>
            <div className="flex items-center rounded-xl border border-[#ddd]">
              <button
                type="button"
                className="p-2"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <IconMinus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center text-[14px] font-semibold">{qty}</span>
              <button type="button" className="p-2" onClick={() => setQty((q) => q + 1)}>
                <IconPlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (galleryRef.current) flyToCart(galleryRef.current, activeImg);
                addToCart(product, qty);
                showToast(dict.addedToCart, 1800);
              }}
              className="flex-1 rounded-xl bg-[#e5004d] px-4 py-3 text-[14px] font-semibold text-white hover:bg-[#c40042]"
            >
              {dict.addToCart}
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(product, qty);
                router.push(`/${locale}/sifaris`);
              }}
              className="flex-1 rounded-xl border border-[#e5004d] px-4 py-3 text-[14px] font-semibold text-[#e5004d] hover:bg-[#fff3f7]"
            >
              {dict.buyNow}
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              className={`rounded-xl border px-3 py-3 ${fav ? "border-[#e5004d] text-[#e5004d]" : "border-[#ddd] text-[#666]"}`}
            >
              <IconHeart className="h-5 w-5" filled={fav} />
            </button>
            <button
              type="button"
              onClick={() => {
                const ok = toggleCompare(product.id);
                if (!ok) showToast(dict.compareLimit, 2000);
              }}
              className={`rounded-xl border px-3 py-3 ${cmp ? "border-[#e5004d] text-[#e5004d]" : "border-[#ddd] text-[#666]"}`}
            >
              <IconCompare className="h-5 w-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOneClickOpen(true)}
            className="mb-4 w-full rounded-xl border-2 border-dashed border-[#e5004d]/40 bg-[#fffafc] px-4 py-3 text-[14px] font-semibold text-[#e5004d] hover:border-[#e5004d] hover:bg-[#fff3f7]"
          >
            {oneClickLabel}
          </button>

          <div className="rounded-xl bg-[#f8f8f8] p-4 text-[13px] text-[#555]">
            <div className="mb-1 font-semibold text-[#222]">{dict.delivery}</div>
            <div>{dict.freeDelivery}</div>
            <Link
              href={`/${locale}/catdirilma-ve-odeme`}
              className="mt-2 inline-block text-[12px] font-semibold text-[#e5004d]"
            >
              {dict.deliveryPayment} →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#eee] bg-white p-4 md:p-6">
        <h2 className="mb-4 text-[18px] font-bold">{dict.specs}</h2>
        <dl className="divide-y divide-[#eee]">
          {product.specs.map((s) => (
            <div key={s.label.az} className="grid grid-cols-2 gap-3 py-3 text-[14px]">
              <dt className="text-[#777]">{s.label[locale]}</dt>
              <dd className="font-medium text-[#222]">{s.value[locale]}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 rounded-2xl border border-[#eee] bg-white p-4 md:p-6">
        <h2 className="mb-4 text-[18px] font-bold">{reviewsTitle}</h2>
        <ul className="mb-6 space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-[#eee] p-4">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-[13px]">
                <span className="font-semibold text-[#222]">{r.author}</span>
                <span className="text-[#f5a623]">{"★".repeat(r.rating)}</span>
                <span className="text-[#999]">{formatReviewDate(r.date, locale)}</span>
              </div>
              <p className="text-[14px] leading-relaxed text-[#555]">{r.text}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={submitReview} className="rounded-xl bg-[#f8f8f8] p-4">
          <h3 className="mb-3 text-[15px] font-bold text-[#222]">{dict.writeReview}</h3>
          <div className="mb-3 grid gap-3 md:grid-cols-2">
            <input
              value={reviewAuthor}
              onChange={(e) => setReviewAuthor(e.target.value)}
              placeholder={locale === "az" ? "Adınız" : "Ваше имя"}
              className="rounded-xl border border-[#ddd] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
            />
            <label className="flex items-center gap-2 text-[14px] text-[#555]">
              {locale === "az" ? "Qiymət" : "Оценка"}
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="rounded-lg border border-[#ddd] bg-white px-2 py-1"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </select>
            </label>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
            placeholder={
              locale === "az" ? "Təcrübənizi yazın..." : "Опишите ваш опыт..."
            }
            className="mb-3 w-full rounded-xl border border-[#ddd] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#222] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#444]"
          >
            {dict.writeReview}
          </button>
        </form>
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-[20px] font-bold">{dict.related}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      )}

      <OneClickBuyModal
        open={oneClickOpen}
        onClose={() => setOneClickOpen(false)}
        product={product}
        locale={locale}
        qty={qty}
        onSuccess={() => showToast(oneClickSuccess, 2800)}
      />
    </div>
  );
}
