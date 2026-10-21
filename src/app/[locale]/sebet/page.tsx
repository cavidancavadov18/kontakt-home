import { CartClient } from "@/components/CartClient";
import { getFeaturedProducts } from "@/data/products";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const crossSell = getFeaturedProducts(8);
  return (
    <CartClient locale={locale} dict={dict} crossSell={crossSell} />
  );
}
