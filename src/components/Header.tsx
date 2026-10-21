"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { CatalogMegaMenu } from "./CatalogMegaMenu";
import { MonthlyPaymentModal } from "./MonthlyPaymentModal";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";
import {
  IconCart,
  IconCompare,
  IconGrid,
  IconHeart,
  IconUser,
} from "./Icons";

const LOGO_MOBILE =
  "https://kontakt.az/assets/kontakt-logo-mobile-0zw4YFNW.svg";
const LOGO_DESKTOP =
  "https://kontakt.az/assets/kontakt-logo-desktop-BFTQNdl3.svg";
const EURONICS = "https://kontakt.az/assets/euronics-logo-2-CTZs1TLX.svg";

export function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const { cartCount, favorites, compare, user, logout } = useApp();
  const base = `/${locale}`;
  const otherLocale = locale === "az" ? "ru" : "az";
  const [payOpen, setPayOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 text-white shadow-md">
      <MonthlyPaymentModal
        locale={locale}
        open={payOpen}
        onClose={() => setPayOpen(false)}
      />
      {/* Desktop top utility bar */}
      <div className="hidden border-b border-white/10 bg-[#1a1a1a] md:block">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-8 text-[12px]">
          <nav className="flex items-center gap-5 text-white/90">
            <Link href={`${base}/kampaniyalar`} className="kh-uline hover:text-white">
              {dict.campaigns}
            </Link>
            <Link href={`${base}/trade-in`} className="kh-uline hover:text-white">
              {dict.tradeIn}
            </Link>
            <Link href={`${base}/magazalar`} className="kh-uline hover:text-white">
              {dict.stores}
            </Link>
            <Link
              href={`${base}/divara-qoy`}
              className="font-semibold text-[#ff5a7a] hover:text-white"
            >
              {locale === "az" ? "Divara qoy" : "На стену"}
            </Link>
            <Link
              href={`${base}/korporativ-satislar`}
              className="kh-uline hover:text-white"
            >
              {dict.corporate}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="tel:*6060"
              className="px-1 text-[13px] font-bold tracking-tight text-white"
            >
              <span className="text-[#ff003c]">*</span>6060
            </a>
            <button
              type="button"
              onClick={() => setPayOpen(true)}
              className="rounded-[8px] bg-[#1faa45] px-3 py-[5px] text-[12.5px] font-semibold leading-none text-white transition hover:bg-[#1a983c]"
            >
              {locale === "az" ? "Aylıq Ödəniş" : "Ежемесячный платёж"}
            </button>
            <div className="flex overflow-hidden rounded-[8px] bg-[#6a6a6a] text-[12px] font-bold leading-none text-white">
              <Link
                href={pathname.replace(`/${locale}`, "/az")}
                className={`px-2.5 py-[6px] ${locale === "az" ? "bg-[#3a3a3a]" : ""}`}
              >
                AZ
              </Link>
              <Link
                href={pathname.replace(`/${locale}`, "/ru")}
                className={`px-2.5 py-[6px] ${locale === "ru" ? "bg-[#3a3a3a]" : ""}`}
              >
                RU
              </Link>
            </div>
            <ThemeToggle locale={locale} />
          </div>
        </div>
      </div>

      {/* Desktop main header */}
      <div className="hidden bg-[#2b2b2b] md:block">
        <div className="mx-auto flex h-[66px] max-w-[1440px] items-center gap-4 px-8">
          <div className="flex shrink-0 items-center gap-2.5">
            <Link href={base} className="kh-logo-link flex items-center">
              <Image
                src={LOGO_DESKTOP}
                alt="Kontakt Home"
                width={162}
                height={36}
                className="kh-logo-img h-9 w-auto"
                unoptimized
                priority
              />
            </Link>
            <a
              href="https://www.euronics.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Euronics"
              className="kh-logo-link flex items-center"
            >
              <Image
                src={EURONICS}
                alt="Euronics Group"
                width={39}
                height={37}
                className="kh-euronics-img h-[34px] w-auto"
                unoptimized
              />
            </a>
          </div>

          <CatalogMegaMenu locale={locale} label={dict.catalog} />

          <SearchBox locale={locale} dict={dict} variant="desktop" />

          <div className="flex shrink-0 items-center gap-0.5">
            {user ? (
              <div className="flex w-[88px] flex-col items-center gap-0.5 px-1 py-1">
                <Link
                  href={`${base}/hesab`}
                  className="flex h-6 w-6 items-center justify-center text-white hover:opacity-90"
                  title={user.phone}
                >
                  <IconUser className="h-6 w-6" />
                </Link>
                <Link
                  href={`${base}/hesab`}
                  className="max-w-[80px] truncate text-center text-[10px] font-medium leading-tight text-white hover:opacity-90"
                >
                  {user.name || user.phone}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[9px] font-semibold text-white/70 hover:text-white"
                >
                  {locale === "az" ? "Çıxış" : "Выйти"}
                </button>
              </div>
            ) : (
              <HeaderAction
                href={`${base}/daxil-ol`}
                label={dict.login}
                icon={<IconUser className="h-6 w-6" />}
              />
            )}
            <HeaderAction
              href={`${base}/muqayise`}
              label={dict.compare}
              icon={<IconCompare className="h-6 w-6" />}
              badge={compare.length}
            />
            <HeaderAction
              href={`${base}/secilmisler`}
              label={dict.favorites}
              icon={<IconHeart className="h-6 w-6" />}
              badge={favorites.length}
            />
            <HeaderAction
              href={`${base}/sebet`}
              label={dict.cart}
              icon={<IconCart className="h-6 w-6" />}
              badge={cartCount}
              cartTarget
            />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="bg-[#2b2b2b] md:hidden">
        <div className="relative flex items-center justify-between px-3 py-2.5">
          <a href="tel:*6060" className="text-[14px] font-bold tracking-tight text-white">
            <span className="text-[#ff003c]">*</span>6060
          </a>
          <Link
            href={base}
            className="kh-logo-link absolute left-1/2 -translate-x-1/2"
          >
            <Image
              src={LOGO_MOBILE}
              alt="Kontakt Home"
              width={92}
              height={21}
              className="kh-logo-img h-5 w-auto"
              unoptimized
              priority
            />
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle locale={locale} />
            <Link
              href={pathname.replace(`/${locale}`, `/${otherLocale}`)}
              className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold"
            >
              {otherLocale.toUpperCase()}
            </Link>
            <Link href={`${base}/secilmisler`} className="relative p-1.5" aria-label={dict.favorites}>
              <IconHeart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff003c] px-1 text-[10px] font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href={`${base}/muqayise`} className="relative p-1.5" aria-label={dict.compare}>
              <IconCompare className="h-5 w-5" />
              {compare.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff003c] px-1 text-[10px] font-bold">
                  {compare.length}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10 px-3 pb-3 pt-2">
          <div className="flex items-center gap-2">
            <Link
              href={`${base}/kataloq`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#2b2b2b]"
              aria-label={dict.catalog}
            >
              <IconGrid className="h-5 w-5" />
            </Link>
            <SearchBox locale={locale} dict={dict} variant="mobile" />
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderAction({
  href,
  label,
  icon,
  badge,
  cartTarget,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  cartTarget?: boolean;
}) {
  return (
    <Link
      href={href}
      data-cart-target={cartTarget ? "" : undefined}
      className="group relative flex w-[72px] flex-col items-center gap-1 px-1 py-1 text-center text-white transition hover:opacity-90"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        {icon}
        {badge ? (
          <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff003c] px-1 text-[10px] font-bold leading-none">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="kh-uline text-[11px] font-medium leading-tight tracking-tight">
        {label}
      </span>
    </Link>
  );
}
