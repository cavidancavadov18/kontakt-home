"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { megaMenu } from "@/data/megaMenu";
import type { Locale } from "@/i18n/dictionaries";
import { IconChevron, IconClose, IconGrid } from "./Icons";

export function CatalogMegaMenu({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(megaMenu[0]?.id ?? "winter");
  const rootRef = useRef<HTMLDivElement>(null);
  const base = `/${locale}`;

  const active = useMemo(
    () => megaMenu.find((c) => c.id === activeId) ?? megaMenu[0],
    [activeId]
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[#ff003c] px-4 text-[15px] font-semibold text-white shadow-[0_2px_8px_rgba(255,0,60,0.25)] transition hover:bg-[#e00035]"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {open ? (
          <IconClose className="h-5 w-5" />
        ) : (
          <IconGrid className="h-5 w-5" />
        )}
        {label}
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 top-[102px] z-40 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            className="fixed left-1/2 top-[102px] z-50 flex max-h-[min(640px,calc(100vh-110px))] w-[min(1440px,100vw)] -translate-x-1/2 overflow-hidden rounded-b-2xl border border-t-0 border-[#ececec] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.16)]"
            onClick={(e) => e.stopPropagation()}
          >
            <aside className="w-[300px] shrink-0 overflow-y-auto border-r border-[#f0f0f0] bg-white py-1.5">
              {megaMenu.map((cat) => {
                const on = cat.id === active.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onMouseEnter={() => setActiveId(cat.id)}
                    onFocus={() => setActiveId(cat.id)}
                    onClick={() => setActiveId(cat.id)}
                    className={`flex w-full items-center gap-3 px-4 py-[9px] text-left transition ${
                      on
                        ? "bg-[#fff0f3] text-[#ff003c]"
                        : "text-[#444] hover:bg-[#fafafa] hover:text-[#222]"
                    }`}
                  >
                    <span
                      className={`relative h-6 w-6 shrink-0 ${
                        on ? "kh-cat-icon-active" : "kh-cat-icon"
                      }`}
                    >
                      <Image
                        src={cat.icon}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="24px"
                        unoptimized
                      />
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] font-medium leading-snug">
                      {cat.name[locale]}
                    </span>
                    <IconChevron
                      className={`h-4 w-4 shrink-0 ${
                        on ? "text-[#ff003c]" : "text-[#d0d0d0]"
                      }`}
                    />
                  </button>
                );
              })}
            </aside>

            <div className="flex min-w-0 flex-1 bg-white">
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-6 xl:grid-cols-3">
                    {active.groups.map((group) => (
                      <div key={`${active.id}-${group.title.az}`}>
                        <Link
                          href={`${base}${group.href ?? active.href}`}
                          onClick={() => setOpen(false)}
                          className="mb-1.5 block text-[13px] font-bold text-[#1a1a1a] hover:text-[#ff003c]"
                        >
                          {group.title[locale]}
                        </Link>
                        {group.links?.length ? (
                          <ul className="space-y-1">
                            {group.links.map((link) => (
                              <li key={link.az}>
                                <Link
                                  href={`${base}${link.href}`}
                                  onClick={() => setOpen(false)}
                                  className="text-[13px] leading-5 text-[#777] transition hover:text-[#ff003c]"
                                >
                                  {link[locale]}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#f0f0f0] px-6 py-3">
                  <Link
                    href={`${base}${active.href}`}
                    onClick={() => setOpen(false)}
                    className="kh-uline inline-flex items-center gap-1 text-[13px] font-semibold text-[#ff003c]"
                  >
                    {locale === "az"
                      ? "Bütün alt kateqoriyalar"
                      : "Все подкатегории"}
                    <IconChevron className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {active.promo ? (
                <div className="hidden w-[250px] shrink-0 border-l border-[#f0f0f0] p-3 lg:block">
                  <Link
                    href={`${base}${active.href}`}
                    onClick={() => setOpen(false)}
                    className="relative block h-full min-h-[520px] overflow-hidden rounded-xl"
                  >
                    <Image
                      src={active.promo}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="250px"
                      unoptimized
                    />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
