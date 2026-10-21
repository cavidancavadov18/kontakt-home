import { CompareClient } from "@/components/CompareClient";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  return <CompareClient locale={locale} dict={dict} />;
}
