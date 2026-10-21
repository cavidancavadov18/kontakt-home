"use client";

import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Footer } from "./Footer";
import { TrustBar } from "./TrustBar";

export function FooterArea({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const isHome =
    pathname === `/${locale}` ||
    pathname === `/${locale}/` ||
    pathname === "/";

  return (
    <>
      {/* Homepage shows advantages after categories; other pages above footer */}
      {!isHome ? <TrustBar locale={locale} /> : null}
      <Footer locale={locale} dict={dict} />
    </>
  );
}
