export type Campaign = {
  id: string;
  slug: string;
  title: { az: string; ru: string };
  description: { az: string; ru: string };
  image: string;
  endsAt: string;
  href: string;
};

const base = "https://api.kontakt.az/media/dinarys/banner/images";

export const campaigns: Campaign[] = [
  {
    id: "samsung-trade",
    slug: "samsung-trade-in",
    title: {
      az: "Samsung-u əlavə endirimlə al",
      ru: "Купи Samsung с дополнительной скидкой",
    },
    description: {
      az: "İstənilən smartfonu gətir — 450 AZN-dək əlavə endirim. Samsung S və Z seriyası.",
      ru: "Принеси любой смартфон — скидка до 450 AZN. Серии Samsung S и Z.",
    },
    image: `${base}/1024_az1024.jpg_3_kkk_trade_in_samsung_16.10.jpeg`,
    endsAt: "2026-11-30",
    href: "/kataloq/smartfonlar",
  },
  {
    id: "iphone",
    slug: "iphone-18-pro",
    title: {
      az: "iPhone 18 Pro artıq satışda",
      ru: "iPhone 18 Pro уже в продаже",
    },
    description: {
      az: "Yeni nəsil iPhone — xüsusi şərtlər və hissə-hissə ödənişlə.",
      ru: "Новое поколение iPhone — спецусловия и рассрочка.",
    },
    image: `${base}/1024_az1024_2_14.10.26_18.jpg`,
    endsAt: "2026-12-15",
    href: "/kataloq/smartfonlar",
  },
  {
    id: "kombi",
    slug: "kombi-kampaniya",
    title: {
      az: "Kombi sistemləri endirimlə",
      ru: "Комби-системы со скидкой",
    },
    description: {
      az: "Evini qışa hazırla — kombi və qızdırıcılarda sərfəli təkliflər.",
      ru: "Подготовь дом к зиме — выгодные предложения на комби и обогреватели.",
    },
    image: `${base}/1024x434_2x_kombi_16.10.26_az.jpg`,
    endsAt: "2026-11-20",
    href: "/kataloq/ev-texnikasi",
  },
  {
    id: "apple-duo",
    slug: "apple-kampaniya",
    title: {
      az: "Apple məhsullarında duo təkliflər",
      ru: "Duo-предложения на продукцию Apple",
    },
    description: {
      az: "iPhone, AirPods və digər Apple məhsullarında xüsusi paket endirimləri.",
      ru: "Специальные пакетные скидки на iPhone, AirPods и другие товары Apple.",
    },
    image: `${base}/1024x434az_new_19.10.26.jpg`,
    endsAt: "2026-12-01",
    href: "/kataloq/apple",
  },
  {
    id: "rayban",
    slug: "ray-ban-meta",
    title: {
      az: "Ray-Ban Meta Kontakt-da rəsmidir",
      ru: "Ray-Ban Meta официально в Kontakt",
    },
    description: {
      az: "Smart eynəklərin rəsmi satışına start verildi.",
      ru: "Официальный старт продаж умных очков.",
    },
    image: `${base}/rayban-kontaktda-resmidir-_mobile-az_neww_s.jpg`,
    endsAt: "2026-12-31",
    href: "/kataloq/smart-qadjetler",
  },
  {
    id: "autumn",
    slug: "payiz-endirimleri",
    title: {
      az: "Payız endirimləri",
      ru: "Осенние скидки",
    },
    description: {
      az: "Minlərlə məhsulda mövsümi endirimlər və pulsuz çatdırılma.",
      ru: "Сезонные скидки на тысячи товаров и бесплатная доставка.",
    },
    image: `${base}/yeni_sayt_1024_az_mobile_02.10.26.jpg`,
    endsAt: "2026-11-15",
    href: "/kataloq",
  },
];
