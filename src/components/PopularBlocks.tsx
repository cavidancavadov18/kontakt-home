import Image from "next/image";
import Link from "next/link";
import { popularBlocks } from "@/data/homeSections";
import type { Locale } from "@/i18n/dictionaries";
import { IconChevron } from "./Icons";

export function PopularBlocks({
  locale,
  overlay = false,
}: {
  locale: Locale;
  /** Sit on top of the hero banner (desktop live layout) */
  overlay?: boolean;
}) {
  const groups = [popularBlocks.phones, popularBlocks.home, popularBlocks.kitchen];

  return (
    <section
      className={
        overlay
          ? "mx-auto hidden max-w-[1440px] px-6 lg:px-10 md:block"
          : "mx-auto hidden max-w-[1440px] px-6 py-5 md:block lg:px-10"
      }
    >
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {groups.map((group, gi) => (
          <article
            key={group.title.az}
            className={`kh-pop-panel kh-reveal ${
              gi === 0
                ? "kh-reveal-delay-1"
                : gi === 1
                  ? "kh-reveal-delay-2"
                  : "kh-reveal-delay-3"
            } ${
              overlay
                ? "rounded-2xl border border-[#e8e8e8] bg-white p-3 shadow-[0_6px_20px_rgba(0,0,0,0.08)] lg:p-3.5"
                : "rounded-2xl border border-[#ebebeb] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            }`}
          >
            <div
              className={`flex items-center justify-between gap-2 ${overlay ? "mb-2" : "mb-3"}`}
            >
              <h2
                className={`font-semibold leading-tight text-[#222] ${
                  overlay ? "text-[15px] lg:text-[17px]" : "text-[18px] lg:text-[20px]"
                }`}
              >
                <Link
                  href={`/${locale}${group.items[0]?.href || "/kataloq"}`}
                  className="kh-uline"
                >
                  {group.title[locale]}
                </Link>
              </h2>
              <IconChevron className="h-5 w-5 shrink-0 text-[#999]" />
            </div>
            <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
              {group.items.map((item) => (
                <Link
                  key={item.name.az}
                  href={`/${locale}${item.href}`}
                  className={`kh-pop-tile group/cat flex flex-col items-center rounded-xl bg-[#f3f3f3] px-2 transition hover:bg-[#ececec] ${
                    overlay ? "py-2.5" : "py-3"
                  }`}
                >
                  <div
                    className={`kh-pop-img relative mb-1 overflow-hidden rounded-lg ${
                      overlay ? "h-[52px] w-[52px] lg:h-[58px] lg:w-[58px]" : "h-[72px] w-[72px]"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name[locale]}
                      fill
                      className="object-contain p-0.5"
                      sizes="72px"
                      unoptimized
                    />
                  </div>
                  <span
                    className={`text-center font-medium leading-snug text-[#333] ${
                      overlay ? "text-[11px] lg:text-[12px]" : "text-[12px] lg:text-[13px]"
                    }`}
                  >
                    {item.name[locale]}
                  </span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
