import { WallFit } from "@/components/WallFit";
import type { Locale } from "@/i18n/dictionaries";

export default async function WallFitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return <WallFit locale={locale} />;
}
