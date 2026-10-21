"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { apiPost } from "@/lib/api";
import type { Locale } from "@/i18n/dictionaries";

type Msg = { from: "bot" | "user"; text: string };

function ChatLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden
    >
      <circle cx="30" cy="30" r="30" fill="#FF003C" />
      <path
        d="M30.7385 18.4203C37.5437 18.4203 43.0604 23.937 43.0604 30.7422C43.0604 37.5474 37.5437 43.0641 30.7385 43.0641C28.6802 43.0641 26.6938 42.5581 24.9211 41.6069L20.0942 43.0564C19.3857 43.2691 18.6389 42.8672 18.4262 42.1588C18.3507 41.9074 18.3508 41.6394 18.4263 41.3881L19.8761 36.5639C18.9235 34.7901 18.4167 32.8022 18.4167 30.7422C18.4167 23.937 23.9333 18.4203 30.7385 18.4203ZM30.7385 20.0275C24.821 20.0275 20.0239 24.8247 20.0239 30.7422C20.0239 32.639 20.5167 34.4622 21.4402 36.0701L21.6125 36.3702L20.1088 41.3739L25.1146 39.8708L25.4145 40.0428C27.0215 40.9649 28.8432 41.4569 30.7385 41.4569C36.6561 41.4569 41.4532 36.6598 41.4532 30.7422C41.4532 24.8247 36.6561 20.0275 30.7385 20.0275ZM26.7205 32.3494H31.5403C31.9841 32.3494 32.3439 32.7092 32.3439 33.153C32.3439 33.5598 32.0415 33.8961 31.6493 33.9493L31.5403 33.9566H26.7205C26.2767 33.9566 25.9169 33.5968 25.9169 33.153C25.9169 32.7462 26.2192 32.41 26.6115 32.3568L26.7205 32.3494H31.5403H26.7205ZM26.7205 27.5278H34.7613C35.2051 27.5278 35.5649 27.8876 35.5649 28.3314C35.5649 28.7382 35.2626 29.0745 34.8704 29.1277L34.7613 29.135H26.7205C26.2767 29.135 25.9169 28.7752 25.9169 28.3314C25.9169 27.9246 26.2192 27.5884 26.6115 27.5352L26.7205 27.5278H34.7613H26.7205Z"
        fill="white"
      />
    </svg>
  );
}

const QUICK_AZ = [
  "Sifariş statusu",
  "Çatdırılma",
  "Zəmanət",
  "Mağazalar",
];
const QUICK_RU = ["Статус заказа", "Доставка", "Гарантия", "Магазины"];

export function LiveChat({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const ticketSentRef = useRef(false);
  const az = locale === "az";

  function maybeOpenTicket(message: string) {
    if (ticketSentRef.current) return;
    ticketSentRef.current = true;
    void apiPost("/api/chat/ticket", { message }).catch(() => {
      ticketSentRef.current = false;
    });
  }

  useEffect(() => {
    if (!open) return;
    setMsgs((m) =>
      m.length
        ? m
        : [
            {
              from: "bot",
              text: az
                ? "Salam! Kontakt-a xoş gəlmisiniz. Necə kömək edə bilərəm?"
                : "Здравствуйте! Добро пожаловать в Kontakt. Чем помочь?",
            },
          ]
    );
  }, [open, az]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, open]);

  function reply(userText: string) {
    maybeOpenTicket(userText);
    const lower = userText.toLowerCase();
    let bot = az
      ? "Operator tezliklə cavab verəcək. Əlavə suallar üçün *6060 və ya WhatsApp yazın."
      : "Оператор скоро ответит. Также можно позвонить *6060 или написать в WhatsApp.";
    if (/çatdır|dostav|delivery/i.test(lower)) {
      bot = az
        ? "49.99 AZN-dən yuxarı sifarişlərə çatdırılma pulsuzdur. Detallar: Çatdırılma və ödəmə."
        : "Доставка бесплатна от 49.99 AZN. Подробнее: Доставка и оплата.";
    } else if (/zəman|garan/i.test(lower)) {
      bot = az
        ? "Bütün məhsullara rəsmi zəmanət verilir. Zəmanətlər səhifəsinə baxın."
        : "На все товары действует официальная гарантия.";
    } else if (/mağaza|magaza|store/i.test(lower)) {
      bot = az
        ? "Mağazalarımızı xəritədə tapa bilərsiniz: Mağazalar bölməsi."
        : "Найдите магазины на карте в разделе Магазины.";
    } else if (/sifariş|status|заказ/i.test(lower)) {
      bot = az
        ? "Sifariş statusunu öyrənmək üçün telefon nömrənizi və sifariş kodunu yazın, və ya *6060 zəng edin."
        : "Для статуса заказа укажите номер телефона и код, или позвоните *6060.";
    }
    setMsgs((m) => [
      ...m,
      { from: "user", text: userText },
      { from: "bot", text: bot },
    ]);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    setInput("");
    reply(t);
  }

  return (
    <>
      {open ? (
        <div className="kh-chat-panel fixed bottom-[92px] right-4 z-50 flex w-[min(360px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.22)] md:bottom-24 md:right-6">
          <div className="flex items-center gap-3 bg-[#ff003c] px-4 py-3 text-white">
            <span className="kh-chat-logo-spin relative h-10 w-10 shrink-0">
              <ChatLogo className="h-10 w-10" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold">Kontakt Live Chat</div>
              <div className="text-[11px] text-white/85">
                {az ? "Onlayn · adətən dərhal cavab" : "Онлайн · обычно сразу"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-[18px] leading-none hover:bg-white/15"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div
            ref={listRef}
            className="flex max-h-[280px] flex-col gap-2 overflow-y-auto bg-[#f7f7f7] p-3"
          >
            {msgs.map((m, i) => (
              <div
                key={`${i}-${m.text.slice(0, 12)}`}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${
                  m.from === "user"
                    ? "ml-auto rounded-br-md bg-[#ff003c] text-white"
                    : "rounded-bl-md bg-white text-[#222] shadow-sm"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-[#eee] bg-white px-3 py-2">
            {(az ? QUICK_AZ : QUICK_RU).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => reply(q)}
                className="rounded-full border border-[#e5e5e5] bg-[#fafafa] px-2.5 py-1 text-[11px] font-medium text-[#444] transition hover:border-[#ff003c] hover:text-[#ff003c]"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-[#eee] bg-white p-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={az ? "Mesaj yazın..." : "Напишите сообщение..."}
              className="h-10 min-w-0 flex-1 rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-3 text-[13px] outline-none focus:border-[#ff003c]"
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff003c] text-white hover:bg-[#e00035]"
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M3.4 20.6 21 12 3.4 3.4l.1 6.8L14 12 3.5 13.8l-.1 6.8Z" />
              </svg>
            </button>
          </form>

          <div className="flex gap-2 border-t border-[#eee] bg-[#fafafa] px-3 py-2 text-[11px]">
            <a
              href="tel:*6060"
              className="font-semibold text-[#ff003c] hover:underline"
            >
              *6060
            </a>
            <span className="text-[#ccc]">·</span>
            <a
              href="https://wa.me/994508286060"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#25d366] hover:underline"
            >
              WhatsApp
            </a>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="kh-chat-fab fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6"
        aria-label="Live chat"
        aria-expanded={open}
      >
        <span className="kh-chat-fab-pulse" aria-hidden />
        <span className="kh-chat-fab-logo relative z-[1] block h-[60px] w-[60px]">
          {open ? (
            <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#ff003c] text-[28px] font-light text-white">
              ×
            </span>
          ) : (
            <ChatLogo className="h-[60px] w-[60px]" />
          )}
        </span>
      </button>
    </>
  );
}
