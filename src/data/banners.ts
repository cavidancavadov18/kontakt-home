import type { Locale } from "@/i18n/dictionaries";

export type Banner = {
  id: string;
  alt: { az: string; ru: string };
  mobile: { az: string; ru: string };
  desktop: { az: string; ru: string };
  href: string;
};

export type PromoBanner = {
  id: string;
  alt: { az: string; ru: string };
  image: { az: string; ru: string };
  href: string;
};

const base = "https://api.kontakt.az/media/dinarys/banner/images";

export const banners: Banner[] = [
  {
    id: "iphone-18",
    alt: { az: "iPhone 18 Pro", ru: "iPhone 18 Pro" },
    mobile: {
      az: `${base}/1024_az1024_2_14.10.26_18.jpg`,
      ru: `${base}/1024_ru1024_2_14.10.26_18.jpg`,
    },
    desktop: {
      az: `${base}/1920x600_2_13.10.26_hh_1.jpg`,
      ru: `${base}/1920x600_2_13.10.26_hh_1.jpg`,
    },
    href: "/kataloq/smartfonlar",
  },
  {
    id: "apple-duo",
    alt: { az: "Apple duo", ru: "Apple duo" },
    mobile: {
      az: `${base}/1024x434az_new_19.10.26.jpg`,
      ru: `${base}/1024x434ru_new_19.10.26.jpg`,
    },
    desktop: {
      az: `${base}/1920x600az_new_19.10.26_1.jpg`,
      ru: `${base}/1920x600az_new_19.10.26_1.jpg`,
    },
    href: "/kataloq/apple",
  },
  {
    id: "samsung-trade",
    alt: { az: "Samsung trade-in", ru: "Samsung trade-in" },
    mobile: {
      az: `${base}/1024_az1024.jpg_3_kkk_trade_in_samsung_16.10.jpeg`,
      ru: `${base}/1024_ru1024.jpg_1_hh_trade_in_samsung_16.10.jpeg`,
    },
    desktop: {
      az: `${base}/1920x600-aze__smsng_16.10.26_gg_3.jpg`,
      ru: `${base}/1920x600-aze__smsng_16.10.26_gg_3.jpg`,
    },
    href: "/kampaniyalar",
  },
  {
    id: "payiz",
    alt: { az: "Payız kampaniyası", ru: "Осенняя акция" },
    mobile: {
      az: `${base}/yeni_sayt_1024_az_mobile_02.10.26.jpg`,
      ru: `${base}/yeni_sayt_1024x_ru_mobile_02.10.26.jpg`,
    },
    desktop: {
      az: `${base}/1920x600ru_01.10.26_1.jpg`,
      ru: `${base}/1920x600ru_01.10.26_1.jpg`,
    },
    href: "/kampaniyalar",
  },
  {
    id: "samsung",
    alt: { az: "Samsung", ru: "Samsung" },
    mobile: {
      az: `${base}/1024x434az_samsung_05.10.26.jpg`,
      ru: `${base}/1024x434_ru_samsung_05.10.26.jpg`,
    },
    desktop: {
      az: `${base}/1920x600_az_samsung_05.10.26_3.jpg`,
      ru: `${base}/1920x600_az_samsung_05.10.26_3.jpg`,
    },
    href: "/kataloq/smartfonlar",
  },
  {
    id: "kombi",
    alt: { az: "Kombi kampaniyası", ru: "Акция на комби" },
    mobile: {
      az: `${base}/1024x434_2x_kombi_16.10.26_az.jpg`,
      ru: `${base}/1024x434_ru_2x_kombi_16.10.26.jpg`,
    },
    desktop: {
      az: `${base}/1920x600_kombi_16.10.26_1.png`,
      ru: `${base}/1920x600_kombi_16.10.26_1.png`,
    },
    href: "/kataloq/ev-texnikasi",
  },
  {
    id: "rayban",
    alt: { az: "Ray-Ban Meta", ru: "Ray-Ban Meta" },
    mobile: {
      az: `${base}/rayban-kontaktda-resmidir-_mobile-az_neww_s.jpg`,
      ru: `${base}/rayban-kontaktda-resmidir-_neww_smobile-ru.jpg`,
    },
    desktop: {
      az: `${base}/rayban-kontaktda-resmidir-_mobile-az_neww_s.jpg`,
      ru: `${base}/rayban-kontaktda-resmidir-_neww_smobile-ru.jpg`,
    },
    href: "/kataloq/smart-qadjetler",
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: "xiaomi",
    alt: {
      az: "Hər gün üçün seçimin — Xiaomi Redmi Note 17",
      ru: "Выбор на каждый день — Xiaomi Redmi Note 17",
    },
    image: {
      az: `${base}/_ChatGPT_30_._2026_._16_07_59.png`,
      ru: `${base}/_ChatGPT_30_._2026_._16_07_59.png`,
    },
    href: "/kataloq/smartfonlar",
  },
  {
    id: "weofly",
    alt: {
      az: "Weofly Active 3-lə- Aktiv qal, daha yaxşı nəticə əldə et",
      ru: "Weofly Active 3 — оставайся активным",
    },
    image: {
      az: `${base}/_-_WEOFLY_Active_3.png`,
      ru: `${base}/_-_WEOFLY_Active_3.png`,
    },
    href: "/kataloq/smart-qadjetler",
  },
  {
    id: "promokod",
    alt: {
      az: "Promokodunu tətbiq et, endirimdən yararlan",
      ru: "Примени промокод и получи скидку",
    },
    image: {
      az: `${base}/promokodunu_indi_yoxla_1_.png`,
      ru: `${base}/254434.png`,
    },
    href: "/kampaniyalar",
  },
  {
    id: "philips",
    alt: {
      az: "Hamar təraş - hər gün özünəinam Philips XP9202/10",
      ru: "Гладкое бритье каждый день — Philips XP9202/10",
    },
    image: {
      az: `${base}/_Philips.png`,
      ru: `${base}/_Philips.png`,
    },
    href: "/kataloq/gozellik",
  },
];

export function bannerImage(
  image: { az: string; ru: string },
  locale: Locale
) {
  return image[locale] ?? image.az;
}
