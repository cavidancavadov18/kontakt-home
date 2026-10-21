import { BestsellersSection } from "@/components/BestsellersSection";
import { BrandStrip } from "@/components/BrandStrip";
import { CampaignStrip } from "@/components/CampaignStrip";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCarousel } from "@/components/ProductCarousel";
import { TrustBar } from "@/components/TrustBar";
import { BlogSection } from "@/components/BlogSection";
import { HotDealsSection } from "@/components/HotDealsSection";
import { VideoReviews } from "@/components/VideoReviews";
import { banners } from "@/data/banners";
import { quickCategories } from "@/data/categories";
import { homeProductSlugs, sectionTitles } from "@/data/homeSections";
import { bestsellerChips, bestsellerPhoneSlugs } from "@/data/homeMedia";
import {
  expandHomeList,
  getFeaturedProducts,
  getProductsByCategory,
  getProductsBySlugs,
} from "@/data/products";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const weekly = getProductsBySlugs(homeProductSlugs.weekly);
  const installment = expandHomeList(
    homeProductSlugs.installment,
    (p) =>
      /iphone|playstation|soyuducu|kondisioner|divan|paltaryuyan|televizor|notbuk/i.test(
        p.name.az
      ),
    16
  );
  const happyDeals = expandHomeList(
    homeProductSlugs.happyDeals,
    (p) => (p.discount ?? 0) >= 15,
    16
  );
  const together = getProductsBySlugs(homeProductSlugs.together);
  const seasonal = getProductsBySlugs(homeProductSlugs.seasonal);
  const newOffers = getProductsBySlugs(homeProductSlugs.newOffers);

  const phoneBestsellers = expandHomeList(
    bestsellerPhoneSlugs,
    (p) =>
      p.category === "smartfonlar" ||
      /iphone|galaxy|redmi|xiaomi/i.test(p.slug),
    16
  );
  const productsByCategory = Object.fromEntries(
    bestsellerChips.map((c) => {
      if (c.category === "smartfonlar" && phoneBestsellers.length) {
        return [c.category, phoneBestsellers];
      }
      const featured = getFeaturedProducts(16, c.category);
      return [
        c.category,
        featured.length
          ? featured
          : getProductsByCategory(c.category).slice(0, 16),
      ];
    })
  );

  return (
    <>
      <HeroSlider banners={banners} locale={locale} />
      <CategoryGrid items={quickCategories} locale={locale} />

      {/* Real kontakt.az order: advantages → Həftənin məhsulları → Satış liderləri */}
      <TrustBar locale={locale} />

      <ProductCarousel
        title={sectionTitles.weekProducts[locale]}
        badge={sectionTitles.affordable[locale]}
        products={weekly}
        locale={locale}
        dict={dict}
        href={`/${locale}/kataloq`}
      />

      <BestsellersSection
        locale={locale}
        dict={dict}
        title={sectionTitles.bestsellers[locale]}
        productsByCategory={productsByCategory}
      />

      <ProductCarousel
        title={sectionTitles.installment[locale]}
        products={installment}
        locale={locale}
        dict={dict}
        href={`/${locale}/kataloq`}
      />

      <BrandStrip locale={locale} />

      <HotDealsSection
        title={sectionTitles.happyDeals[locale]}
        products={happyDeals}
        locale={locale}
        dict={dict}
      />

      <CampaignStrip locale={locale} title={sectionTitles.newOffers[locale]} />

      <ProductCarousel
        title={sectionTitles.together[locale]}
        products={together.length ? together : newOffers}
        locale={locale}
        dict={dict}
        href={`/${locale}/kataloq/birlikde-al`}
      />

      <ProductCarousel
        title={sectionTitles.seasonal[locale]}
        products={seasonal}
        locale={locale}
        dict={dict}
        href={`/${locale}/kampaniyalar`}
      />

      <VideoReviews
        locale={locale}
        title={locale === "az" ? "Kontakt Video" : "Видеообзоры"}
      />

      <BlogSection locale={locale} />
    </>
  );
}
