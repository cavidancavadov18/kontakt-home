import Link from "next/link";
import { advantages } from "@/data/advantages";
import type { Locale } from "@/i18n/dictionaries";
import { AdvantageIcon } from "./AdvantageIcon";

export function TrustBar({ locale }: { locale: Locale }) {
  return (
    <section className="kh-advantages border-y border-[#e8e8e8] bg-[#f5f5f5] py-3.5 md:py-4">
      <div className="mx-auto max-w-[1440px] px-3 md:px-6 lg:px-10">
        <div className="kh-adv-row flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {advantages.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.href}`}
              title={item.desc[locale]}
              className="kh-adv-card kh-4d kh-tilt group flex w-[min(200px,78vw)] shrink-0 items-center gap-2.5 rounded-lg border border-[#ced0d3] bg-white px-3 py-3 text-[#111] transition hover:border-[#ff003c]/40 hover:shadow-[0_4px_14px_rgba(255,0,60,0.08)] md:w-[188px]"
            >
              <span className="kh-adv-icon flex h-7 w-7 shrink-0 items-center justify-center text-[#111] transition group-hover:text-[#ff003c]">
                <AdvantageIcon name={item.icon} className="h-7 w-7" />
              </span>
              <span className="text-[12px] font-semibold leading-snug md:text-[12.5px]">
                {item.title[locale]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
