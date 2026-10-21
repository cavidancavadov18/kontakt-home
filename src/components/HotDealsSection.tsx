import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { hotDealsBg } from "@/data/homeMedia";
import type { Dictionary, Locale } from "@/i18n/dictionaries";

export function HotDealsSection({
  locale,
  dict,
  products,
  title,
}: {
  locale: Locale;
  dict: Dictionary;
  products: Product[];
  title: string;
}) {
  return (
    <section className="relative my-4 overflow-hidden">
      <div className="relative mx-auto min-h-[420px] w-full max-w-[1920px] md:min-h-[520px]">
        <Image
          src={hotDealsBg}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          unoptimized
          priority={false}
        />
        <div className="relative mx-auto max-w-[1440px] px-3 py-8 md:px-6 md:py-10 lg:px-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-[18px] font-semibold text-white drop-shadow md:text-[22px]">
              <Link href={`/${locale}/kampaniyalar`} className="kh-uline">
                {title}
              </Link>
            </h2>
            <Link
              href={`/${locale}/kampaniyalar`}
              className="kh-uline text-[13px] font-semibold text-white"
            >
              {dict.seeAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.slice(0, 12).map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
