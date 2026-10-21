"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/dictionaries";

export function MonthlyPaymentModal({
  locale,
  open,
  onClose,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}) {
  const [fin, setFin] = useState("");
  const [contract, setContract] = useState("");
  const [result, setResult] = useState<"idle" | "ok" | "err">("idle");
  const [dueAmount, setDueAmount] = useState(0);

  useEffect(() => {
    if (!open) {
      setResult("idle");
      setFin("");
      setContract("");
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (fin.trim().length < 5 || contract.trim().length < 3) {
      setResult("err");
      return;
    }
    // Mock installment due from contract digits
    const digits = contract.replace(/\D/g, "") || "120";
    const seed = Number(digits.slice(-4)) || 120;
    setDueAmount(Math.round((35 + (seed % 220) + seed / 100) * 100) / 100);
    setResult("ok");
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
        aria-labelledby="monthly-pay-title"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id="monthly-pay-title"
            className="text-[18px] font-bold text-[#222]"
          >
            {locale === "az" ? "Aylıq Ödəniş" : "Ежемесячный платёж"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[18px] text-[#888] hover:bg-[#f5f5f5]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {result === "ok" ? (
          <div className="space-y-3 text-[14px] text-[#444]">
            <div className="rounded-xl bg-[#e8f5e9] px-4 py-3 text-center">
              <div className="text-[12px] font-medium text-[#2e7d32]">
                {locale === "az" ? "Bu ay ödənilməli" : "К оплате в этом месяце"}
              </div>
              <div className="text-[28px] font-bold text-[#1b5e20]">
                {dueAmount.toFixed(2)} ₼
              </div>
              <div className="text-[11px] text-[#666]">
                {locale === "az" ? `Müqavilə: ${contract}` : `Договор: ${contract}`}
              </div>
            </div>
            <p>
              {locale === "az"
                ? "Məlumatlar qəbul olundu. Ödənişi mağazada, MilliÖn / e-manat terminalında və ya bank tətbiqində tamamlaya bilərsiniz."
                : "Данные приняты. Оплату можно завершить в магазине, терминале MilliÖn / e-manat или в банковском приложении."}
            </p>
            <Link
              href={`/${locale}/hisse-hisse-odenis-sertleri`}
              className="inline-flex text-[13px] font-semibold text-[#e5004d]"
              onClick={onClose}
            >
              {locale === "az"
                ? "Ödəniş şərtlərinə bax →"
                : "Смотреть условия →"}
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-[#e5004d] py-2.5 text-[14px] font-semibold text-white"
            >
              {locale === "az" ? "Bağla" : "Закрыть"}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <p className="text-[13px] text-[#666]">
              {locale === "az"
                ? "FİN kod və müqavilə nömrəsini daxil edin."
                : "Введите FIN-код и номер договора."}
            </p>
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold">
                FİN
              </span>
              <input
                value={fin}
                onChange={(e) => setFin(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
                placeholder="XXXXXXX"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold">
                {locale === "az" ? "Müqavilə №" : "№ договора"}
              </span>
              <input
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                className="w-full rounded-xl border border-[#ddd] px-3 py-2.5 text-[14px] outline-none focus:border-[#e5004d]"
                required
              />
            </label>
            {result === "err" ? (
              <p className="text-[12px] text-[#e5004d]">
                {locale === "az"
                  ? "Məlumatları yoxlayın və ya *6060-a zəng edin."
                  : "Проверьте данные или позвоните *6060."}
              </p>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#2e7d32] py-2.5 text-[14px] font-semibold text-white"
            >
              {locale === "az" ? "Davam et" : "Продолжить"}
            </button>
            <a
              href="tel:*6060"
              className="block text-center text-[13px] font-semibold text-[#e5004d]"
            >
              *6060
            </a>
          </form>
        )}
      </div>
    </div>
  );
}
