"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { searchProducts } from "@/data/products";
import {
  popularProducts,
  popularSearches,
  searchCategories,
  searchPlaceholders,
} from "@/data/searchSuggest";
import { formatPrice } from "@/lib/format";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { IconSearch } from "./Icons";

function useTypewriter(words: string[], enabled: boolean) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setText("");
      return;
    }
    let cancelled = false;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const word = words[wordIndex % words.length];
    setText("");

    function tick() {
      if (cancelled) return;
      if (!deleting) {
        char += 1;
        setText(word.slice(0, char));
        if (char >= word.length) {
          deleting = true;
          timer = setTimeout(tick, 1400);
          return;
        }
        timer = setTimeout(tick, 70);
      } else {
        char -= 1;
        setText(word.slice(0, Math.max(0, char)));
        if (char <= 0) {
          setWordIndex((i) => (i + 1) % words.length);
          return;
        }
        timer = setTimeout(tick, 40);
      }
    }

    timer = setTimeout(tick, 280);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [wordIndex, words, enabled]);

  return text;
}

export function SearchBox({
  locale,
  dict,
  variant = "desktop",
}: {
  locale: Locale;
  dict: Dictionary;
  variant?: "desktop" | "mobile";
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), 200);
    return () => window.clearTimeout(id);
  }, [query]);

  const productHits = useMemo(() => {
    const term = debouncedQuery.trim();
    if (!term) return [];
    return searchProducts(term, 500).slice(0, 8);
  }, [debouncedQuery]);

  const isSearching = debouncedQuery.trim().length > 0;

  const typing = useTypewriter(
    searchPlaceholders,
    !focused && !query && !open
  );

  const base = `/${locale}`;

  const goSearch = useCallback(
    (q: string) => {
      const term = q.trim();
      if (!term) return;
      setOpen(false);
      setQuery(term);
      router.push(`${base}/axtaris?q=${encodeURIComponent(term)}`);
    },
    [base, router]
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    goSearch(query || typing);
  }

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    // defer so the opening mousedown doesn't immediately close
    const id = window.setTimeout(() => {
      document.addEventListener("mousedown", onDoc);
    }, 0);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isDesktop = variant === "desktop";
  const showHint = !query && !focused;

  return (
    <div ref={rootRef} className={`relative min-w-0 ${isDesktop ? "flex-1" : "flex-1"}`}>
      <form
        onSubmit={onSubmit}
        className={
          isDesktop
            ? "relative flex min-w-0 flex-1"
            : "relative flex min-w-0 flex-1 gap-2"
        }
      >
        <div className="relative min-w-0 flex-1">
          {showHint ? (
            <span
              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#999] ${
                isDesktop ? "" : "left-4"
              }`}
              aria-hidden
            >
              {typing}
              <span className="ml-px inline-block h-[1em] w-[1px] animate-pulse bg-[#999] align-[-2px]" />
            </span>
          ) : null}
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onMouseDown={() => {
              setFocused(true);
              setOpen(true);
            }}
            onFocus={() => {
              setFocused(true);
              setOpen(true);
            }}
            onBlur={() => {
              // delay so clicks inside the panel still register
              setTimeout(() => setFocused(false), 150);
            }}
            placeholder={showHint ? "" : dict.search}
            autoComplete="off"
            className={
              isDesktop
                ? "h-11 w-full rounded-l-lg border-0 bg-white px-4 text-[15px] text-[#222] outline-none"
                : "h-11 w-full rounded-xl bg-white px-4 text-[15px] text-[#222] outline-none"
            }
            aria-label={dict.search}
            aria-expanded={open}
          />
        </div>
        <button
          type="submit"
          className={
            isDesktop
              ? "flex h-11 w-12 items-center justify-center rounded-r-lg bg-[#ff003c] text-white hover:bg-[#e00035]"
              : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff003c] text-white"
          }
          aria-label={dict.search}
        >
          <IconSearch className="h-5 w-5" />
        </button>
      </form>

      {open ? (
        <>
          {isDesktop ? (
            <div
              className="fixed inset-0 top-[102px] z-40 bg-black/25"
              aria-hidden
              onMouseDown={() => setOpen(false)}
            />
          ) : null}
          <div
            className={`z-50 overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] ${
              isDesktop
                ? "absolute left-0 right-0 top-[calc(100%+10px)]"
                : "absolute left-0 right-0 top-[calc(100%+8px)]"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isSearching ? (
              <div className="p-4 md:p-5">
                <h3 className="mb-3 text-[14px] font-semibold text-[#222]">
                  {locale === "az" ? "Məhsullar" : "Товары"}
                </h3>
                {productHits.length ? (
                  <ul className="divide-y divide-[#f3f3f3]">
                    {productHits.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`${base}/mehsul/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 py-3 transition hover:bg-[#fafafa]"
                        >
                          <div className="relative h-14 w-14 shrink-0">
                            <Image
                              src={p.image}
                              alt={p.name[locale]}
                              fill
                              className="object-contain"
                              sizes="56px"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-[14px] font-medium leading-5 text-[#222]">
                              {p.name[locale]}
                            </div>
                            {p.oldPrice ? (
                              <div className="text-[12px] text-[#999] line-through">
                                {formatPrice(p.oldPrice, locale)}
                              </div>
                            ) : null}
                            <div className="text-[15px] font-bold text-[#ff003c]">
                              {formatPrice(p.price, locale)}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-6 text-center text-[14px] text-[#888]">
                    {locale === "az"
                      ? "Məhsul tapılmadı"
                      : "Товары не найдены"}
                  </p>
                )}
                {productHits.length ? (
                  <button
                    type="button"
                    onClick={() => goSearch(debouncedQuery)}
                    className="mt-2 w-full rounded-xl border border-[#eee] py-2.5 text-[14px] font-semibold text-[#ff003c] transition hover:bg-[#fff5f7]"
                  >
                    {locale === "az"
                      ? "Bütün nəticələrə bax"
                      : "Смотреть все результаты"}
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <div className="grid gap-5 p-4 md:grid-cols-[200px_1fr] md:gap-6 md:p-5">
                  <div>
                    <h3 className="mb-3 text-[14px] font-semibold text-[#222]">
                      {locale === "az"
                        ? "Populyar axtarışlar"
                        : "Популярные запросы"}
                    </h3>
                    <ul className="space-y-1">
                      {popularSearches.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => goSearch(term)}
                            className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left text-[14px] text-[#444] transition hover:bg-[#f7f7f7] hover:text-[#ff003c]"
                          >
                            <IconSearch className="h-4 w-4 shrink-0 text-[#bbb]" />
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-[14px] font-semibold text-[#222]">
                      {locale === "az"
                        ? "Populyar məhsullar"
                        : "Популярные товары"}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {popularProducts.map((p) => (
                        <Link
                          key={p.slug}
                          href={`${base}/mehsul/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="rounded-xl border border-[#f0f0f0] p-3 transition hover:border-[#ffd0da] hover:shadow-sm"
                        >
                          <div className="relative mx-auto mb-2 h-[88px] w-[88px]">
                            <Image
                              src={p.image}
                              alt={p.name[locale]}
                              fill
                              className="object-contain"
                              sizes="88px"
                              unoptimized
                            />
                          </div>
                          <div className="mb-1.5 line-clamp-2 min-h-[40px] text-[13px] font-medium leading-5 text-[#222]">
                            {p.name[locale]}
                          </div>
                          {p.oldPrice ? (
                            <div className="text-[12px] text-[#999] line-through">
                              {formatPrice(p.oldPrice, locale)}
                            </div>
                          ) : null}
                          <div className="text-[15px] font-bold text-[#ff003c]">
                            {formatPrice(p.price, locale)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#f3f3f3] px-4 py-4 md:px-5">
                  <h3 className="mb-3 text-[14px] font-semibold text-[#222]">
                    {locale === "az" ? "Kateqoriyalar" : "Категории"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {searchCategories.map((c) => (
                      <Link
                        key={c.az}
                        href={`${base}${c.href}`}
                        onClick={() => setOpen(false)}
                        className="rounded-full bg-[#f3f3f3] px-3.5 py-1.5 text-[13px] font-medium text-[#333] transition hover:bg-[#ffe5eb] hover:text-[#ff003c]"
                      >
                        {c[locale]}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
