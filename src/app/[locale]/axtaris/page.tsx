import { CatalogClient } from "@/components/CatalogClient";
import { searchProducts } from "@/data/products";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: raw } = await params;
  const { q = "" } = await searchParams;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const results = searchProducts(q);

  return (
    <CatalogClient
      products={results}
      locale={locale}
      dict={dict}
      title={`${dict.searchResults}${q ? `: “${q}”` : ""}`}
    />
  );
}
