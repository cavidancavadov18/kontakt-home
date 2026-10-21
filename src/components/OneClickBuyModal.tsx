"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { apiPost } from "@/lib/api";
import { saveOneClickOrder } from "@/lib/oneClickOrders";
import type { Locale } from "@/i18n/dictionaries";

export function OneClickBuyModal({
  open,
  onClose,
  product,
  locale,
  qty,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
  locale: Locale;
  qty: number;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setPhone("");
      setError("");
      setBusy(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const t =
    locale === "az"
      ? {
          title: "1 kliklə al",
          hint: "Operator sizinlə əlaqə saxlayacaq.",
          name: "Ad, soyad",
          phone: "Mobil nömrə",
          submit: "Sifarişi göndər",
          err: "Ad və düzgün telefon daxil edin.",
        }
      : {
          title: "Купить в 1 клик",
          hint: "Оператор свяжется с вами.",
          name: "Имя и фамилия",
          phone: "Мобильный телефон",
          submit: "Отправить заказ",
          err: "Введите имя и корректный телефон.",
        };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const digits = phone.replace(/\D/g, "");
    if (n.length < 2 || digits.length < 9) {
      setError(t.err);
      return;
    }
    if (busy) return;
    setBusy(true);
    setError("");

    const localPayload = {
      productId: product.id,
      productSlug: product.slug,
      productName: product.name[locale],
      customerName: n,
      phone: phone.trim(),
      qty,
    };

    try {
      await apiPost("/api/one-click", {
        name: n,
        phone: phone.trim(),
        productId: product.id,
        slug: product.slug,
        productName: product.name[locale],
      });
    } catch {
      saveOneClickOrder(localPayload);
    }

    setBusy(false);
    onSuccess();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="one-click-title"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="one-click-title" className="text-[18px] font-bold text-[#222]">
              {t.title}
            </h2>
            <p className="mt-1 text-[13px] text-[#666]">{t.hint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[18px] text-[#888] hover:bg-[#f5f5f5]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={(e) => void submit(e)} className="space-y-3">
          <label className="block text-[13px] font-semibold text-[#444]">
            {t.name}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
              autoComplete="name"
            />
          </label>
          <label className="block text-[13px] font-semibold text-[#444]">
            {t.phone}
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+994"
            />
          </label>
          {error ? <p className="text-[13px] text-[#c40042]">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#e5004d] py-3 text-[14px] font-semibold text-white hover:bg-[#c40042] disabled:opacity-70"
          >
            {busy ? "…" : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
