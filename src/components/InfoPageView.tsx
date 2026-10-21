import Image from "next/image";
import Link from "next/link";
import type { InfoPage } from "@/data/infoPages";
import type { Locale } from "@/i18n/dictionaries";

export function InfoPageView({
  page,
  locale,
}: {
  page: InfoPage;
  locale: Locale;
}) {
  return (
    <div className="mx-auto max-w-5xl px-3 py-5 md:px-6 md:py-8">
      <nav className="mb-3 text-[12px] text-[var(--kh-muted)]">
        <Link href={`/${locale}`} className="hover:text-[var(--kh-pink)]">
          {locale === "az" ? "Əsas səhifə" : "Главная"}
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-[var(--foreground)]">{page.title[locale]}</span>
      </nav>

      <h1 className="mb-5 text-[24px] font-bold text-[var(--foreground)] md:text-[30px]">
        {page.title[locale]}
      </h1>

      {page.banners?.length ? (
        <div className="mb-6 space-y-4">
          {page.banners.map((src) => (
            <div
              key={src}
              className="kh-banner-curve w-full overflow-hidden bg-[var(--kh-bg)] shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
            >
              <Image
                src={src}
                alt={page.title[locale]}
                width={1800}
                height={400}
                className="block h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 1024px"
                unoptimized
                priority
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="kh-surface space-y-7 rounded-[20px] border border-[var(--kh-border)] bg-[var(--kh-card)] p-5 md:p-8">
        {page.images?.map((src) => (
          <div
            key={src}
            className="relative mx-auto aspect-[16/7] w-full max-w-3xl overflow-hidden rounded-[16px] bg-[var(--kh-bg)]"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-contain"
              sizes="800px"
              unoptimized
            />
          </div>
        ))}

        {page.blocks.map((block, i) => (
          <section key={i} className="space-y-3">
            {block.heading ? (
              <h2 className="text-[17px] font-bold text-[var(--foreground)]">
                {block.heading[locale]}
              </h2>
            ) : null}
            {block.paragraphs?.map((p, j) => (
              <p
                key={j}
                className="text-[14px] leading-relaxed text-[var(--kh-muted)]"
              >
                {p[locale]}
              </p>
            ))}
            {block.bullets?.length ? (
              <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-[var(--kh-muted)]">
                {block.bullets.map((b, j) => (
                  <li key={j}>{b[locale]}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {page.contacts?.length ? (
          <section className="space-y-2 border-t border-[var(--kh-border)] pt-5">
            <h2 className="text-[17px] font-bold text-[var(--foreground)]">
              {locale === "az" ? "Əlaqə" : "Контакты"}
            </h2>
            <ul className="space-y-1.5 text-[14px] text-[var(--kh-muted)]">
              {page.contacts.map((c, i) => (
                <li key={i}>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="font-semibold text-[var(--kh-pink)] hover:underline"
                    >
                      {c.label[locale]}
                    </a>
                  ) : (
                    c.label[locale]
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {page.logos?.length ? (
          <section className="border-t border-[var(--kh-border)] pt-6">
            <h2 className="mb-4 text-[17px] font-bold text-[var(--foreground)]">
              {page.logosTitle?.[locale] ??
                (locale === "az" ? "Partnyorlarımız:" : "Наши партнёры:")}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {page.logos.map((logo) => (
                <div
                  key={logo}
                  className="kh-partner-logo relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[var(--kh-border)] bg-white p-2 shadow-sm"
                >
                  <Image
                    src={logo}
                    alt=""
                    fill
                    className="object-contain p-2"
                    sizes="140px"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <p className="mt-6 text-center text-[13px] text-[var(--kh-muted)]">
        {locale === "az" ? "Kömək lazımdır?" : "Нужна помощь?"}{" "}
        <a href="tel:*6060" className="font-semibold text-[var(--kh-pink)]">
          *6060
        </a>
        {" · "}
        <a
          href="https://wa.me/994508286060"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--kh-pink)]"
        >
          WhatsApp
        </a>
      </p>
    </div>
  );
}
