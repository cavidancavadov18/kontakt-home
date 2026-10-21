import { StoresMapSection } from "@/components/StoresMapSection";
import { stores } from "@/data/stores";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function StoresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
      <h1 className="mb-2 text-[22px] font-bold text-[#222] md:text-[28px]">
        {dict.stores}{" "}
        <span className="text-[#e5004d]">{stores.length}</span>
      </h1>
      <p className="mb-6 text-[14px] text-[#666]">
        {locale === "az"
          ? "Kontakt mağazaları — Bakı, Sumqayıt, regionlar və Gürcüstan."
          : "Магазины Kontakt — Баку, Сумгаит, регионы и Грузия."}
      </p>
      <StoresMapSection stores={stores} locale={locale} dict={dict} />
    </div>
  );
}
