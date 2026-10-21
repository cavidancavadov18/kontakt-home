import { CatalogClient } from "@/components/CatalogClient";
import { categories } from "@/data/categories";
import {
  extraCategoryTitles,
  getProductsByCategory,
  products,
} from "@/data/products";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: raw, category } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const cat = categories.find((c) => c.slug === category);
  const extra = extraCategoryTitles[category];
  const list =
    category === "all" ? products : getProductsByCategory(category);

  return (
    <CatalogClient
      products={list}
      locale={locale}
      dict={dict}
      title={cat ? cat.name[locale] : extra ? extra[locale] : dict.catalog}
      categorySlug={category}
    />
  );
}
