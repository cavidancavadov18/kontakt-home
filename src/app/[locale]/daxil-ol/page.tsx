import { LoginClient } from "@/components/LoginClient";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  return <LoginClient locale={locale} dict={dict} />;
}
