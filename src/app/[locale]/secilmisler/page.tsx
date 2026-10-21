import { FavoritesClient } from "@/components/FavoritesClient";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  return <FavoritesClient locale={locale} dict={dict} />;
}
