import Image from "next/image";
import Link from "next/link";
import { campaigns } from "@/data/campaigns";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
      <h1 className="mb-6 text-[22px] font-bold text-[#222] md:text-[28px]">
        {dict.campaigns}
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.map((c) => (
          <article
            key={c.id}
            className="overflow-hidden rounded-2xl border border-[#eee] bg-white shadow-sm"
          >
            <div className="relative aspect-[1024/434] w-full">
              <Image
                src={c.image}
                alt={c.title[locale]}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
            <div className="p-4 md:p-5">
              <h2 className="mb-2 text-[18px] font-bold text-[#222]">
                {c.title[locale]}
              </h2>
              <p className="mb-3 text-[14px] leading-relaxed text-[#555]">
                {c.description[locale]}
              </p>
              <div className="mb-4 text-[12px] font-semibold text-[#888]">
                {dict.campaignEnds}: {c.endsAt}
              </div>
              <Link
                href={`/${locale}${c.href}`}
                className="inline-flex rounded-xl bg-[#e5004d] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#c40042]"
              >
                {dict.goToCampaign}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
