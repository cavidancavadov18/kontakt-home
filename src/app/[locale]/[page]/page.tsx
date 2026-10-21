import { notFound } from "next/navigation";
import { InfoPageView } from "@/components/InfoPageView";
import { getInfoPage, infoPageSlugs } from "@/data/infoPages";
import type { Locale } from "@/i18n/dictionaries";

export function generateStaticParams() {
  return infoPageSlugs.map((page) => ({ page }));
}

export default async function DynamicInfoPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale: raw, page: slug } = await params;
  const locale = raw as Locale;
  const page = getInfoPage(slug);
  if (!page) notFound();
  return <InfoPageView page={page} locale={locale} />;
}
