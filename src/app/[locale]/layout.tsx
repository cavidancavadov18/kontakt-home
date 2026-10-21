import { notFound } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { FooterArea } from "@/components/FooterArea";
import { Header } from "@/components/Header";
import { LiveChat } from "@/components/LiveChat";
import { Providers } from "@/components/Providers";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

const locales: Locale[] = ["az", "ru"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!locales.includes(raw as Locale)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <Providers>
      <div className="flex min-h-screen flex-col bg-[var(--background)] transition-colors duration-450">
        <Header locale={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <FooterArea locale={locale} dict={dict} />
        <BottomNav locale={locale} dict={dict} />
        <LiveChat locale={locale} />
      </div>
    </Providers>
  );
}
