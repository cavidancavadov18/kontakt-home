import { HesabClient } from "@/components/HesabClient";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function HesabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  return <HesabClient locale={locale} dict={dict} />;
}
