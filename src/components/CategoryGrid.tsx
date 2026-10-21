import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/data/categories";
import type { Locale } from "@/i18n/dictionaries";

export function CategoryGrid({
  items,
  locale,
}: {
  items: Category[];
  locale: Locale;
}) {
  return (
    <section className="mx-auto max-w-[1440px] px-3 py-3 md:hidden">
      <div className="grid grid-cols-2 gap-2">
        {items.map((cat) => {
          const href =
            cat.slug === "kampaniyalar"
              ? `/${locale}/kampaniyalar`
              : `/${locale}/kataloq/${cat.slug}`;
          return (
            <Link
              key={cat.id}
              href={href}
              className={`flex min-h-[64px] items-center gap-2.5 rounded-2xl border border-[#eee] p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                cat.accent ? "bg-[#ff003c] text-white" : "bg-white text-[#222]"
              }`}
            >
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/20">
                <Image
                  src={cat.image}
                  alt={cat.name[locale]}
                  fill
                  className="object-cover"
                  sizes="44px"
                  unoptimized
                />
              </div>
              <span className="text-[12px] font-semibold leading-snug">
                {cat.name[locale]}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
