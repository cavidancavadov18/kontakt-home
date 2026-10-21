"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  computeCartPricing,
  FREE_DELIVERY_THRESHOLD,
  PROMOS,
} from "@/lib/cartPricing";
import { expiryOk, luhnOk } from "@/lib/card";
import { formatPrice } from "@/lib/format";
import { apiPost, ApiError } from "@/lib/api";
import { saveOrder } from "@/lib/orders";
import type { Order } from "@/server/db";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

function readSessionPromo(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("kh-promo");
    return raw ? raw.trim().toUpperCase() : null;
  } catch {
    return null;
  }
}

function resolvePromo(ctxPromo: string | null): string | null {
  if (ctxPromo) return ctxPromo.trim().toUpperCase();
  return readSessionPromo();
}

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

export function CheckoutClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { cart, cartTotal, clearCart, promoCode } = useApp();
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: locale === "az" ? "Bakı" : "Баку",
    address: "",
    payment: "cash" as "cash" | "card" | "installment",
    note: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    installmentMonths: "6",
  });

  const appliedPromo = useMemo(
    () => resolvePromo(promoCode),
    [promoCode]
  );

  const subtotal = cartTotal;
  const { discount, deliveryFee, grandTotal } = computeCartPricing(
    subtotal,
    appliedPromo
  );

  if (cart.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-lg px-3 py-16 text-center">
        <p className="mb-4 text-[#777]">{dict.emptyCart}</p>
        <Link
          href={`/${locale}/kataloq`}
          className="inline-flex rounded-xl bg-[#e5004d] px-5 py-3 text-[14px] font-semibold text-white"
        >
          {dict.continueShopping}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-3 py-16 text-center">
        <div className="mb-3 text-[40px] text-[#1a9a4a]">✓</div>
        <h1 className="mb-2 text-[22px] font-bold text-[#222]">
          {locale === "az" ? "Sifariş qəbul olundu!" : "Заказ принят!"}
        </h1>
        <p className="mb-2 text-[14px] text-[#555]">
          {locale === "az" ? "Sifariş №" : "Заказ №"}{" "}
          <strong>{orderId}</strong>
        </p>
        <p className="mb-2 text-[14px] font-semibold text-[#1a9a4a]">
          {locale === "az" ? "Ödəniş qəbul edildi" : "Оплата принята"}
        </p>
        {txnId ? (
          <p className="mb-2 text-[13px] text-[#555]">
            {locale === "az" ? "Əməliyyat №" : "Транзакция №"}{" "}
            <strong>{txnId}</strong>
          </p>
        ) : null}
        <p className="mb-6 text-[13px] text-[#777]">
          {locale === "az"
            ? "Operatorumuz tezliklə sizinlə əlaqə saxlayacaq (*6060)."
            : "Оператор скоро свяжется с вами (*6060)."}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex rounded-xl bg-[#e5004d] px-5 py-3 text-[14px] font-semibold text-white"
        >
          {dict.home}
        </Link>
      </div>
    );
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) {
      next.name =
        locale === "az" ? "Ad, soyad daxil edin" : "Укажите имя и фамилию";
    }
    const phoneDigits = digitsOnly(form.phone);
    if (phoneDigits.length < 9) {
      next.phone =
        locale === "az" ? "Düzgün telefon daxil edin" : "Укажите корректный телефон";
    }
    if (!form.address.trim()) {
      next.address =
        locale === "az" ? "Ünvan daxil edin" : "Укажите адрес";
    }

    if (form.payment === "card") {
      const num = digitsOnly(form.cardNumber);
      if (!luhnOk(num)) {
        next.cardNumber =
          locale === "az"
            ? "Kart nömrəsi düzgün deyil"
            : "Номер карты неверный";
      }
      const exp = form.cardExpiry.trim();
      if (!expiryOk(exp)) {
        next.cardExpiry =
          locale === "az" ? "Kartın vaxtı bitib və ya format AA/İİ deyil" : "Срок истёк или формат не ММ/ГГ";
      }
      const cvv = digitsOnly(form.cardCvv);
      if (cvv.length < 3) {
        next.cardCvv = locale === "az" ? "CVV daxil edin" : "Укажите CVV";
      }
    }

    if (form.payment === "installment" && !form.installmentMonths) {
      next.installmentMonths =
        locale === "az" ? "Taksit müddəti seçin" : "Выберите срок рассрочки";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setSubmitError("");
    const promo = resolvePromo(promoCode);
    const pricing = computeCartPricing(cartTotal, promo);
    const snapshot = [...cart];

    const localPayload = {
      locale,
      items: snapshot.map(({ product, qty }) => ({
        productId: product.id,
        slug: product.slug,
        name: product.name[locale],
        qty,
        unitPrice: product.price,
      })),
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
      },
      payment: {
        method: form.payment,
        ...(form.payment === "installment"
          ? { installmentMonths: Number(form.installmentMonths) }
          : {}),
      },
      subtotal: cartTotal,
      discount: pricing.discount,
      deliveryFee: pricing.deliveryFee,
      total: pricing.grandTotal,
      promoCode: promo,
    };

    const apiOrderBody = {
      locale,
      items: snapshot.map(({ product, qty }) => ({
        productId: product.id,
        qty,
      })),
      customer: localPayload.customer,
      payment: localPayload.payment,
      promoCode: promo,
    };

    try {
      const { order } = await apiPost<{ order: Order }>(
        "/api/orders",
        apiOrderBody
      );

      let transactionId = "";
      try {
        const paid = await apiPost<{ transactionId: string }>(
          "/api/payment/charge",
          {
            orderId: order.id,
            method: form.payment,
            ...(form.payment === "card"
              ? {
                  card: {
                    number: digitsOnly(form.cardNumber),
                    expiry: form.cardExpiry.trim(),
                    cvv: digitsOnly(form.cardCvv),
                  },
                }
              : {}),
          }
        );
        transactionId = paid.transactionId;
      } catch {
        if (form.payment === "card") {
          setSubmitError(
            locale === "az"
              ? "Bank kartı qəbul olunmadı. Nömrə, tarix və CVV-ni yoxlayın."
              : "Банк отклонил карту. Проверьте номер, срок и CVV."
          );
          return;
        }
      }

      setTxnId(transactionId);
      setOrderId(order.id);
      clearCart();
      setDone(true);
    } catch (err) {
      const saved = saveOrder(localPayload);
      setOrderId(saved.id);
      clearCart();
      setDone(true);
      if (err instanceof ApiError && err.status === 409) {
        setSubmitError(
          locale === "az"
            ? "Bəzi məhsullar stokda yoxdur; sifariş yerli qeydə alındı."
            : "Некоторых товаров нет в наличии; заказ сохранён локально."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-3 py-5 md:px-6">
      <h1 className="mb-5 text-[22px] font-bold md:text-[28px]">
        {dict.checkout}
      </h1>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-[#eee] bg-white p-4 md:p-6"
        >
          {(
            [
              ["name", locale === "az" ? "Ad, soyad" : "Имя, фамилия"],
              ["phone", locale === "az" ? "Telefon" : "Телефон"],
              ["city", locale === "az" ? "Şəhər" : "Город"],
              ["address", locale === "az" ? "Ünvan" : "Адрес"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-[13px] font-semibold">
                {label}
              </span>
              <input
                required
                value={form[key]}
                onChange={(e) => {
                  setForm((f) => ({ ...f, [key]: e.target.value }));
                  if (errors[key]) {
                    setErrors((err) => {
                      const copy = { ...err };
                      delete copy[key];
                      return copy;
                    });
                  }
                }}
                className={`w-full rounded-xl border px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d] ${
                  errors[key] ? "border-[#e5004d]" : "border-[#ddd]"
                }`}
              />
              {errors[key] ? (
                <p className="mt-1 text-[12px] text-[#e5004d]">{errors[key]}</p>
              ) : null}
            </label>
          ))}

          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold">
              {locale === "az" ? "Ödəniş üsulu" : "Способ оплаты"}
            </legend>
            <div className="space-y-2 text-[14px]">
              {(
                [
                  ["cash", locale === "az" ? "Nağd" : "Наличные"],
                  ["card", locale === "az" ? "Bank kartı" : "Банковская карта"],
                  ["installment", locale === "az" ? "Taksit" : "Рассрочка"],
                ] as const
              ).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={form.payment === val}
                    onChange={() =>
                      setForm((f) => ({ ...f, payment: val }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {form.payment === "card" ? (
            <div className="space-y-3 rounded-xl border border-[#eee] bg-[#fafafa] p-4">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#888]">
                {locale === "az" ? "Bank kartı" : "Банковская карта"}
              </p>
              <label className="block">
                <span className="mb-1 block text-[13px] font-semibold">
                  {locale === "az" ? "Kart nömrəsi" : "Номер карты"}
                </span>
                <input
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  value={form.cardNumber}
                  onChange={(e) => {
                    const d = digitsOnly(e.target.value).slice(0, 16);
                    const spaced = d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
                    setForm((f) => ({ ...f, cardNumber: spaced }));
                  }}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d] ${
                    errors.cardNumber ? "border-[#e5004d]" : "border-[#ddd]"
                  }`}
                />
                {errors.cardNumber ? (
                  <p className="mt-1 text-[12px] text-[#e5004d]">
                    {errors.cardNumber}
                  </p>
                ) : null}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-[13px] font-semibold">
                    {locale === "az" ? "Bitmə tarixi" : "Срок"}
                  </span>
                  <input
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={form.cardExpiry}
                    onChange={(e) => {
                      let v = digitsOnly(e.target.value).slice(0, 4);
                      if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                      setForm((f) => ({ ...f, cardExpiry: v }));
                    }}
                    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d] ${
                      errors.cardExpiry ? "border-[#e5004d]" : "border-[#ddd]"
                    }`}
                  />
                  {errors.cardExpiry ? (
                    <p className="mt-1 text-[12px] text-[#e5004d]">
                      {errors.cardExpiry}
                    </p>
                  ) : null}
                </label>
                <label className="block">
                  <span className="mb-1 block text-[13px] font-semibold">
                    CVV
                  </span>
                  <input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    value={form.cardCvv}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        cardCvv: digitsOnly(e.target.value).slice(0, 4),
                      }))
                    }
                    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d] ${
                      errors.cardCvv ? "border-[#e5004d]" : "border-[#ddd]"
                    }`}
                  />
                  {errors.cardCvv ? (
                    <p className="mt-1 text-[12px] text-[#e5004d]">
                      {errors.cardCvv}
                    </p>
                  ) : null}
                </label>
              </div>
            </div>
          ) : null}

          {form.payment === "installment" ? (
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold">
                {locale === "az" ? "Taksit müddəti" : "Срок рассрочки"}
              </span>
              <select
                value={form.installmentMonths}
                onChange={(e) =>
                  setForm((f) => ({ ...f, installmentMonths: e.target.value }))
                }
                className="w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
              >
                {[3, 6, 12, 18].map((m) => (
                  <option key={m} value={String(m)}>
                    {m} {locale === "az" ? "ay" : "мес."}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold">
              {locale === "az" ? "Qeyd" : "Комментарий"}
            </span>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
            />
          </label>

          {submitError ? (
            <p className="text-[13px] font-medium text-[#c47a00]">{submitError}</p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/sebet`)}
              disabled={loading}
              className="rounded-xl border border-[#ddd] px-4 py-3 text-[14px] font-semibold disabled:opacity-50"
            >
              {dict.back}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#e5004d] py-3 text-[14px] font-semibold text-white hover:bg-[#c40042] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {locale === "az" ? "Emal olunur…" : "Обработка…"}
                </>
              ) : (
                locale === "az" ? "Sifarişi təsdiqlə" : "Подтвердить заказ"
              )}
            </button>
          </div>
        </form>

        <aside className="h-fit space-y-3 rounded-2xl border border-[#eee] bg-white p-4">
          <h2 className="text-[15px] font-bold">{dict.cart}</h2>
          <ul className="space-y-2 text-[13px] text-[#555]">
            {cart.map(({ product, qty }) => (
              <li key={product.id} className="flex justify-between gap-2">
                <span className="line-clamp-2">
                  {product.name[locale]} × {qty}
                </span>
                <span className="shrink-0 font-semibold text-[#222]">
                  {formatPrice(product.price * qty, locale)}
                </span>
              </li>
            ))}
          </ul>

          {appliedPromo && PROMOS[appliedPromo] ? (
            <p className="text-[12px] font-medium text-[#1a9a4a]">
              {dict.promoApplied}: {appliedPromo}
            </p>
          ) : null}

          <div className="space-y-2 border-t border-[#eee] pt-3 text-[14px]">
            <div className="flex justify-between">
              <span className="text-[#666]">{dict.subtotal}</span>
              <span className="font-semibold">
                {formatPrice(subtotal, locale)}
              </span>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between text-[#1a9a4a]">
                <span>
                  {dict.discount}
                  {(() => {
                    const p = appliedPromo ? PROMOS[appliedPromo] : undefined;
                    return p?.type === "percent" ? ` (${p.value}%)` : "";
                  })()}
                </span>
                <span className="font-semibold">
                  −{formatPrice(discount, locale)}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-[#666]">{dict.delivery}</span>
              <span className="font-semibold">
                {deliveryFee === 0
                  ? dict.freeDelivery
                  : formatPrice(deliveryFee, locale)}
              </span>
            </div>
            {subtotal < FREE_DELIVERY_THRESHOLD &&
            appliedPromo !== "FREEDELIVERY" ? (
              <p className="text-[11px] text-[#999]">
                {dict.freeDeliveryHint}{" "}
                {formatPrice(
                  Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
                  locale
                )}
              </p>
            ) : null}
          </div>

          <div className="flex justify-between border-t border-[#eee] pt-3 text-[15px] font-bold">
            <span>{dict.total}</span>
            <span>{formatPrice(grandTotal, locale)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
