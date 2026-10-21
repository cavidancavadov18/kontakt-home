/** Real homepage media blocks from kontakt.az (desktop measurements) */

export const videoCards = [
  {
    id: "xiaomi",
    alt: {
      az: "Hər gün üçün seçimin — Xiaomi Redmi Note 17",
      ru: "Выбор на каждый день — Xiaomi Redmi Note 17",
    },
    image:
      "https://api.kontakt.az/media/dinarys/banner/images/_ChatGPT_30_._2026_._16_07_59.png",
    href: "/kataloq/smartfonlar",
    youtubeId: "T3w0qOvH5_o",
  },
  {
    id: "weofly",
    alt: {
      az: "Weofly Active 3-lə- Aktiv qal, daha yaxşı nəticə əldə et",
      ru: "Weofly Active 3 — оставайся активным",
    },
    image:
      "https://api.kontakt.az/media/dinarys/banner/images/_-_WEOFLY_Active_3.png",
    href: "/kataloq/smart-qadjetler",
    youtubeId: "yrONKayXmqc",
  },
  {
    id: "promokod",
    alt: {
      az: "Promokodunu tətbiq et, endirimdən yararlan",
      ru: "Примени промокод и получи скидку",
    },
    image: {
      az: "https://api.kontakt.az/media/dinarys/banner/images/promokodunu_indi_yoxla_1_.png",
      ru: "https://api.kontakt.az/media/dinarys/banner/images/254434.png",
    },
    href: "/kampaniyalar",
    youtubeId: "T3w0qOvH5_o",
  },
  {
    id: "philips",
    alt: {
      az: "Hamar təraş - hər gün özünəinam Philips XP9202/10",
      ru: "Гладкое бритье каждый день — Philips XP9202/10",
    },
    image: "https://api.kontakt.az/media/dinarys/banner/images/_Philips.png",
    href: "/kataloq/gozellik",
    youtubeId: "yrONKayXmqc",
  },
  {
    id: "hoffmann",
    alt: {
      az: "Hər yumada qənaət — Hoffmann WMH6012W",
      ru: "Экономия на каждой стирке — Hoffmann WMH6012W",
    },
    image: "https://api.kontakt.az/media/dinarys/banner/images/_HOFFMANN.png",
    href: "/kataloq/ev-texnikasi",
    youtubeId: "T3w0qOvH5_o",
  },
] as const;

export const campaignCards = [
  {
    id: "autumn",
    alt: { az: "Payız fürsətlə gəldi", ru: "Осень пришла с выгодой" },
    image: "https://api.kontakt.az/media/promotions/1038x500_az_01.10.26.jpg",
    href: "/kampaniyalar",
  },
  {
    id: "120",
    alt: { az: "120% qiymətə zəmanət", ru: "Гарантия цены 120%" },
    image: "https://api.kontakt.az/media/promotions/1038x500-aze_15.10.26.jpg",
    href: "/kampaniyalar",
  },
  {
    id: "bosch",
    alt: { az: "Bosch hədiyyə kampaniyası", ru: "Подарочная акция Bosch" },
    image:
      "https://api.kontakt.az/media/promotions/1038x500_az_07.10.26_bosch_2_.png",
    href: "/kampaniyalar",
  },
  {
    id: "rayban",
    alt: { az: "Ray-Ban", ru: "Ray-Ban" },
    image:
      "https://api.kontakt.az/media/promotions/rayban-kontaktda-resmidir-_09.10.26_ss_1038x500-az.png",
    href: "/kataloq/smart-qadjetler",
  },
];

export const appleSideBanner = {
  image:
    "https://api.kontakt.az/media/dinarys/content-builder/Apple_logo_banner_1.png",
  href: "/kataloq/apple",
  alt: { az: "Apple Authorized Reseller", ru: "Apple Authorized Reseller" },
};

export const hotDealsBg =
  "https://api.kontakt.az/media/dinarys/content-builder/ui_sayt.png";

/** Exact “Satış liderləri” chips from kontakt.az */
export const bestsellerChips = [
  { az: "Smartfonlar", ru: "Смартфоны", category: "smartfonlar" },
  { az: "Notbuklar", ru: "Ноутбуки", category: "notbuklar" },
  { az: "Televizorlar", ru: "Телевизоры", category: "tv-audio" },
  { az: "Qulaqlıqlar", ru: "Наушники", category: "smart-qadjetler" },
  { az: "Saatlar", ru: "Часы", category: "smart-qadjetler" },
  {
    az: "Böyük məişət texnikası",
    ru: "Крупная бытовая техника",
    category: "ev-texnikasi",
  },
  {
    az: "Mətbəx üçün xırda məişət texnikası",
    ru: "Мелкая кухонная техника",
    category: "metbex-texnikasi",
  },
  {
    az: "Quraşdırılan texnika",
    ru: "Встраиваемая техника",
    category: "metbex-texnikasi",
  },
  {
    az: "Ev üçün kiçik texnika",
    ru: "Мелкая техника для дома",
    category: "ev-texnikasi",
  },
  {
    az: "İqlim texnikası",
    ru: "Климатическая техника",
    category: "ev-texnikasi",
  },
  { az: "Aksesuarlar", ru: "Аксессуары", category: "smart-qadjetler" },
  { az: "Gözəllik və sağlamlıq", ru: "Красота и здоровье", category: "gozellik" },
  { az: "Mebel", ru: "Мебель", category: "mebel" },
  { az: "Tekstil", ru: "Текстиль", category: "mebel" },
  { az: "Qab-qacaq", ru: "Посуда", category: "qab-qacaq" },
];

/** Live homepage product slugs (exact from kontakt.az) */
export const bestsellerPhoneSlugs = [
  "iphone-17-pro-max-256-gb-cosmic-orange",
  "iphone-15-128-gb-blue",
  "iphone-15-128-gb-black",
  "iphone-17-pro-max-256-gb-deep-blue",
  "samsung-galaxy-s25-sm-s931b-12-128-gb-silver",
  "samsung-galaxy-s26-ultra-sm-s948b-12-512-gb-cobalt-violet",
  "samsung-galaxy-a37-sm-a376e-8-256-gb-dark-green",
  "xiaomi-17t-12-256-gb-deep-blue",
];
