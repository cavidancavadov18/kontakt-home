import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
  footerChips,
  footerKontakt,
  footerServices,
  footerSocial,
  footerSupport,
  type FooterLink,
} from "@/data/footer";
import { IconPin } from "./Icons";

const EURONICS =
  "https://kontakt.az/assets/euronics-logo-2-CTZs1TLX.svg";

function ColLink({
  link,
  base,
  locale,
}: {
  link: FooterLink;
  base: string;
  locale: Locale;
}) {
  const label = link[locale];
  const className =
    "kh-uline text-[13px] leading-5 text-[#bdbdbd] transition hover:text-white";
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={`${base}${link.href}`} className={className}>
      {label}
    </Link>
  );
}

function SocialIcon({ id }: { id: (typeof footerSocial)[number]["id"] }) {
  const common = "h-[18px] w-[18px]";
  switch (id) {
    case "facebook":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9c0-.6.4-1 1-1Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5.4-8.7a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.5c-2.3 0-2.6 0-3.5.1-.9.1-1.5.2-2 .4a4 4 0 0 0-1.5 1 4 4 0 0 0-1 1.5c-.2.5-.3 1.1-.4 2-.1.9-.1 1.2-.1 3.5s0 2.6.1 3.5c.1.9.2 1.5.4 2a4 4 0 0 0 1 1.5 4 4 0 0 0 1.5 1c.5.2 1.1.3 2 .4.9.1 1.2.1 3.5.1s2.6 0 3.5-.1c.9-.1 1.5-.2 2-.4a4 4 0 0 0 1.5-1 4 4 0 0 0 1-1.5c.2-.5.3-1.1.4-2 .1-.9.1-1.2.1-3.5s0-2.6-.1-3.5c-.1-.9-.2-1.5-.4-2a4 4 0 0 0-1-1.5 4 4 0 0 0-1.5-1c-.5-.2-1.1-.3-2-.4-.9-.1-1.2-.1-3.5-.1Zm0 1.5c2.2 0 2.5 0 3.4.1.8 0 1.2.2 1.5.3.4.1.6.3.9.6.3.3.5.5.6.9.1.3.3.7.3 1.5.1.9.1 1.2.1 3.4s0 2.5-.1 3.4c0 .8-.2 1.2-.3 1.5-.1.4-.3.6-.6.9-.3.3-.5.5-.9.6-.3.1-.7.3-1.5.3-.9.1-1.2.1-3.4.1s-2.5 0-3.4-.1c-.8 0-1.2-.2-1.5-.3-.4-.1-.6-.3-.9-.6-.3-.3-.5-.5-.6-.9-.1-.3-.3-.7-.3-1.5-.1-.9-.1-1.2-.1-3.4s0-2.5.1-3.4c0-.8.2-1.2.3-1.5.1-.4.3-.6.6-.9.3-.3.5-.5.9-.6.3-.1.7-.3 1.5-.3.9-.1 1.2-.1 3.4-.1Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.7 15l-1.1 4 4.1-1.1A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-2.5.7.7-2.4-.2-.3a8.2 8.2 0 1 1 6.5 3.3Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.4l.4-.4c.1-.2.2-.3.2-.5 0-.2 0-.3-.1-.5l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.8-.9 2 0 1.2.9 2.3 1 2.5.1.2 1.8 2.8 4.4 3.8 1.9.7 2.3.6 2.7.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.4-.3Z" />
        </svg>
      );
    case "telegram":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21.5 4.3 2.9 11.4c-1.3.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.7.4.9.9.9.5 0 .7-.2 1-.5l2.7-2.6 5.6 4.1c.7.4 1.1.2 1.3-.6l2.3-10.9c.3-1.1-.4-1.6-1.1-1.3ZM8.8 13.9l9.4-5.9c.4-.3.8-.1.5.2l-7.6 6.9-.3 3.2-1.9-4.4Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M19.6 8.2a6.3 6.3 0 0 1-3.7-1.2v7.1a5.6 5.6 0 1 1-5.6-5.6c.3 0 .5 0 .8.1v2.8a2.8 2.8 0 1 0 2 2.7V2.5h2.7a3.7 3.7 0 0 0 3.7 3.7v2Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6.3 9.3H3.6V20h2.7V9.3ZM5 4a1.6 1.6 0 1 0 0 3.2A1.6 1.6 0 0 0 5 4Zm15.4 6.4c-1.4 0-2.4.7-2.8 1.4h-.1V9.3h-2.7c0 .4 0 10.7 0 10.7h2.7v-6c0-.3 0-.7.1-1 .3-.7.9-1.4 2-1.4 1.4 0 2 1.1 2 2.6V20H22v-6.3c0-3-1.6-4.3-3.6-4.3Z" />
        </svg>
      );
    default:
      return null;
  }
}

export function Footer({
  locale,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const base = `/${locale}`;

  return (
      <footer className="kh-footer mt-auto bg-[#141414] text-white">
        <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-10 md:px-8 lg:px-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            <div>
              <h3 className="mb-4 text-[15px] font-bold text-white">Kontakt</h3>
              <ul className="space-y-2.5">
                {footerKontakt.map((link) => (
                  <li key={link.href}>
                    <ColLink link={link} base={base} locale={locale} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-[15px] font-bold text-white">
                {locale === "az" ? "Müştəriyə dəstək" : "Поддержка клиентов"}
              </h3>
              <ul className="space-y-2.5">
                {footerSupport.map((link) => (
                  <li key={link.href}>
                    <ColLink link={link} base={base} locale={locale} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-[15px] font-bold text-white">
                {locale === "az" ? "Xidmət və servislər" : "Услуги и сервисы"}
              </h3>
              <ul className="space-y-2.5">
                {footerServices.map((link) => (
                  <li key={link.href}>
                    <ColLink link={link} base={base} locale={locale} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-[15px] font-bold text-white">
                {locale === "az" ? "Əlaqə" : "Контакты"}
              </h3>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <a
                  href="tel:*6060"
                  className="kh-hotline kh-uline text-[28px] font-bold leading-none tracking-tight transition hover:text-[#ff2d5c]"
                >
                  *6060
                </a>
                <Link
                  href={`${base}/magazalar`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#3a3a3a] px-3.5 py-1.5 text-[12px] font-medium text-white transition hover:bg-[#4a4a4a]"
                >
                  <IconPin className="h-3.5 w-3.5" />
                  {locale === "az" ? "Xəritə" : "Карта"}
                </Link>
              </div>
              <p className="mb-3 text-[13px] font-semibold text-white">
                {locale === "az"
                  ? "Biz sosial şəbəkələrdə"
                  : "Мы в социальных сетях"}
              </p>
              <div className="flex flex-wrap gap-2">
                {footerSocial.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3a3a3a] text-white transition hover:bg-[#ff003c]"
                  >
                    <SocialIcon id={s.id} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="mb-3 text-[14px] font-bold text-white">
              {locale === "az" ? "Kateqoriyalar:" : "Категории:"}
            </div>
            <div className="flex flex-wrap gap-2">
              {footerChips.map((chip) => (
                <Link
                  key={chip.az}
                  href={`${base}${chip.href}`}
                  className="rounded-full border border-white/20 bg-transparent px-3 py-1.5 text-[12px] text-[#e8e8e8] transition hover:border-[#ff003c] hover:text-white"
                >
                  {chip[locale]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#141414]">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-10">
            <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#aaa]">
              <span>© Kontakt 2026</span>
              <a
                href="https://www.euronics.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Euronics"
                className="inline-flex items-center"
              >
                <Image
                  src={EURONICS}
                  alt="Euronics Group"
                  width={39}
                  height={28}
                  className="h-6 w-auto opacity-90"
                  unoptimized
                />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 min-w-[52px] items-center justify-center rounded bg-[#2a2a2a] px-2 text-[11px] font-bold tracking-wide text-[#8ea3c7]">
                VISA
              </span>
              <span className="inline-flex h-8 min-w-[52px] items-center justify-center rounded bg-[#2a2a2a] px-2">
                <svg viewBox="0 0 36 22" className="h-4 w-7" aria-label="Mastercard">
                  <circle cx="13" cy="11" r="8" fill="#eb001b" />
                  <circle cx="23" cy="11" r="8" fill="#f79e1b" />
                  <path
                    d="M18 5.2a8 8 0 0 1 0 11.6 8 8 0 0 1 0-11.6Z"
                    fill="#ff5f00"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </footer>
  );
}
