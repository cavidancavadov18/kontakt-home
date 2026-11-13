"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import type { Product } from "@/data/products";
import { apiPost } from "@/lib/api";
import {
  computeCartPricing,
  FREE_DELIVERY_THRESHOLD,
  PROMOS,
} from "@/lib/cartPricing";
import type { PromoValidation } from "@/types/api";
import { formatPrice } from "@/lib/format";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { IconMinus, IconPlus } from "./Icons";
import { ProductCard } from "./ProductCard";

export function CartClient({
  locale,
  dict,
  crossSell = [],
}: {
  locale: Locale;
  dict: Dictionary;
  crossSell?: Product[];
}) {
  const {
    cart,
    updateQty,
    removeFromCart,
    cartTotal,
    clearCart,
    promoCode,
    setPromoCode,
  } = useApp();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoBusy, setPromoBusy] = useState(false);

  const appliedPromo = promoCode;
  const subtotal = cartTotal;

  const { discount, deliveryFee, grandTotal, qualifiesFreeDelivery } =
    useMemo(
      () => computeCartPricing(subtotal, appliedPromo),
      [subtotal, appliedPromo]
    );

  useEffect(() => {
    if (promoCode) setPromoInput(promoCode);
  }, [promoCode]);

  const deliveryProgress = Math.min(
    100,
    (subtotal / FREE_DELIVERY_THRESHOLD) * 100
  );
  const amountToFreeDelivery = Math.max(
    0,
    Math.round((FREE_DELIVERY_THRESHOLD - subtotal) * 100) / 100
  );

  const cartIds = useMemo(() => new Set(cart.map((c) => c.product.id)), [cart]);
  const crossSellVisible = crossSell
    .filter((p) => !cartIds.has(p.id))
    .slice(0, 4);

  async function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code || promoBusy) return;
    setPromoBusy(true);
    setPromoError("");
    try {
      const result = await apiPost<PromoValidation>("/api/promo/validate", {
        code,
        subtotal,
      });
      if (!result.valid) {
        setPromoError(dict.invalidPromo);
        setPromoCode(null);
        return;
      }
      setPromoCode(result.code);
      setPromoInput(result.code);
    } catch {
      if (!PROMOS[code]) {
        setPromoError(dict.invalidPromo);
        setPromoCode(null);
        return;
      }
      setPromoCode(code);
      setPromoInput(code);
    } finally {
      setPromoBusy(false);
    }
  }

  function clearPromo() {
    setPromoCode(null);
    setPromoInput("");
    setPromoError("");
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-16 text-center md:px-6">
        <h1 className="mb-3 text-[24px] font-bold">{dict.cart}</h1>
        <p className="mb-6 text-[#777]">{dict.emptyCart}</p>
        <Link
          href={`/${locale}/kataloq`}
          className="inline-flex rounded-xl bg-[#e5004d] px-5 py-3 text-[14px] font-semibold text-white"
        >
          {dict.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-3 py-5 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[22px] font-bold md:text-[28px]">{dict.cart}</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-[13px] font-semibold text-[#e5004d]"
        >
          {dict.clearAll}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          {cart.map(({ product, qty }) => (
            <div
              key={product.id}
              className="flex gap-3 rounded-2xl border border-[#eee] bg-white p-3"
            >
              <Link
                href={`/${locale}/mehsul/${product.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#fafafa]"
              >
                <Image
                  src={product.image}
                  alt={product.name[locale]}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/${locale}/mehsul/${product.slug}`}
                  className="mb-1 line-clamp-2 text-[14px] font-semibold text-[#222]"
                >
                  {product.name[locale]}
                </Link>
                <div className="mb-2 text-[16px] font-bold">
                  {formatPrice(product.price * qty, locale)}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center rounded-xl border border-[#ddd]">
                    <button
                      type="button"
                      className="p-2"
                      onClick={() => updateQty(product.id, qty - 1)}
                    >
                      <IconMinus className="h-4 w-4" />
                    </button>
                    <span className="min-w-7 text-center text-[13px] font-semibold">
                      {qty}
                    </span>
                    <button
                      type="button"
                      className="p-2"
                      onClick={() => updateQty(product.id, qty + 1)}
                    >
                      <IconPlus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="text-[13px] text-[#999] hover:text-[#e5004d]"
                  >
                    {dict.remove}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-[#eee] bg-white p-4">
            <label
              htmlFor="cart-promo"
              className="mb-2 block text-[13px] font-semibold text-[#444]"
            >
              {dict.promoCode}
            </label>
            <div className="flex gap-2">
              <input
                id="cart-promo"
                type="text"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  if (promoError) setPromoError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyPromo();
                  }
                }}
                placeholder="KONTAKT10"
                className="min-w-0 flex-1 rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] uppercase outline-none focus:border-[#e5004d]"
                disabled={!!appliedPromo}
              />
              {appliedPromo ? (
                <button
                  type="button"
                  onClick={clearPromo}
                  className="shrink-0 rounded-xl border border-[#ddd] px-4 py-2.5 text-[13px] font-semibold text-[#666] hover:border-[#e5004d] hover:text-[#e5004d]"
                >
                  {dict.remove}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void applyPromo()}
                  disabled={promoBusy}
                  className="shrink-0 rounded-xl bg-[#222] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#444] disabled:opacity-70"
                >
                  {promoBusy ? "…" : dict.applyPromo}
                </button>
              )}
            </div>
            {promoError ? (
              <p className="mt-2 text-[12px] font-medium text-[#e5004d]">
                {promoError}
              </p>
            ) : null}
            {appliedPromo ? (
              <p className="mt-2 text-[12px] font-medium text-[#1a9a4a]">
                {dict.promoApplied}: {appliedPromo}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-[#eee] bg-white p-4">
          {!qualifiesFreeDelivery && amountToFreeDelivery > 0 ? (
            <div>
              <p className="mb-2 text-[12px] text-[#666]">
                {dict.freeDeliveryHint}{" "}
                <span className="font-semibold text-[#222]">
                  {formatPrice(amountToFreeDelivery, locale)}
                </span>
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-[#f0f0f0]">
                <div
                  className="h-full rounded-full bg-[#1a9a4a] transition-all duration-300"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="rounded-xl bg-[#e8f8ef] px-3 py-2 text-[12px] font-semibold text-[#1a9a4a]">
              {dict.freeDelivery}
            </p>
          )}

          <div className="space-y-2 border-t border-[#eee] pt-3 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-[#666]">{dict.subtotal}</span>
              <span className="font-semibold">
                {formatPrice(subtotal, locale)}
              </span>
            </div>
            {discount > 0 ? (
              <div className="flex items-center justify-between text-[#1a9a4a]">
                <span>
                  {dict.discount}
                  {appliedPromo && PROMOS[appliedPromo]?.type === "percent"
                    ? ` (${PROMOS[appliedPromo].value}%)`
                    : ""}
                </span>
                <span className="font-semibold">
                  −{formatPrice(discount, locale)}
                </span>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-[#666]">{dict.delivery}</span>
              <span className="font-semibold">
                {deliveryFee === 0
                  ? dict.freeDelivery
                  : formatPrice(deliveryFee, locale)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#eee] pt-3 text-[15px]">
            <span className="font-semibold text-[#666]">{dict.total}</span>
            <span className="text-[20px] font-extrabold">
              {formatPrice(grandTotal, locale)}
            </span>
          </div>
          <Link
            href={`/${locale}/sifaris`}
            className="block w-full rounded-xl bg-[#e5004d] py-3 text-center text-[14px] font-semibold text-white hover:bg-[#c40042]"
          >
            {dict.checkout}
          </Link>
          <Link
            href={`/${locale}/kataloq`}
            className="block text-center text-[13px] font-semibold text-[#e5004d]"
          >
            {dict.continueShopping}
          </Link>
        </aside>
      </div>

      {crossSellVisible.length > 0 ? (
        <div className="mt-8">
          <h2 className="mb-4 text-[20px] font-bold">{dict.youMayAlsoLike}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {crossSellVisible.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
