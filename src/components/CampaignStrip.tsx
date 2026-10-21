import Image from "next/image";
import Link from "next/link";
import { campaignCards } from "@/data/homeMedia";
import type { Locale } from "@/i18n/dictionaries";

export function CampaignStrip({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  return (
    <section className="mx-auto max-w-[1440px] px-3 py-5 md:px-6 lg:px-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-[#222] md:text-[22px]">
          <Link href={`/${locale}/kampaniyalar`} className="kh-uline">
            {title}
          </Link>
        </h2>
        <Link
          href={`/${locale}/kampaniyalar`}
          className="kh-uline text-[13px] font-semibold text-[#ff003c]"
        >
          {locale === "az" ? "Hamısı" : "Все"}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {campaignCards.map((card) => (
          <Link
            key={card.id}
            href={`/${locale}${card.href}`}
            className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:shadow-md"
          >
            {/* Real site shows 1038x500 banners at ~330x160 */}
            <div className="relative aspect-[1038/500] w-full">
              <Image
                src={card.image}
                alt={card.alt[locale]}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 50vw, 330px"
                unoptimized
              />
            </div>
            <div className="px-3 py-2.5 text-[13px] font-medium text-[#222]">
              {card.alt[locale]}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
