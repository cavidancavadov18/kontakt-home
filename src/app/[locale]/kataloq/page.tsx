import Image from "next/image";
import Link from "next/link";
import { megaMenu } from "@/data/megaMenu";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
      <h1 className="mb-5 text-[22px] font-bold text-[#222] md:text-[28px]">
        {dict.catalog}
      </h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {megaMenu.map((cat) => (
          <Link
            key={cat.id}
            href={`/${locale}${cat.href}`}
            className="flex flex-col items-center gap-3 rounded-2xl border border-[#eee] bg-white p-4 text-center shadow-sm transition hover:border-[#ff003c]/30 hover:shadow-md"
          >
            <div className="relative h-16 w-16">
              <Image
                src={cat.icon}
                alt={cat.name[locale]}
                fill
                className="object-contain"
                sizes="64px"
                unoptimized
              />
            </div>
            <span className="text-[13px] font-semibold leading-snug text-[#222]">
              {cat.name[locale]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
