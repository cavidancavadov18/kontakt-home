import { CheckoutClient } from "@/components/CheckoutClient";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  return <CheckoutClient locale={locale} dict={dict} />;
}
