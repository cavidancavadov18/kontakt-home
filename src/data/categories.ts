export type Category = {
  id: string;
  slug: string;
  name: { az: string; ru: string };
  image: string;
  featured?: boolean;
  accent?: boolean;
};

const media = "https://api.kontakt.az/media/catalog/category/HomePage-mobile-categories";

export const categories: Category[] = [
  {
    id: "promos",
    slug: "kampaniyalar",
    name: { az: "Bütün aksiyalar", ru: "Все акции" },
    image: `${media}/promolar-23-09.png`,
    accent: true,
  },
  {
    id: "winter",
    slug: "evini-qisa-hazirla",
    name: { az: "Evini qışa hazırla", ru: "Будь готов к зиме" },
    image: `${media}/photo_5339345812036724097_w.jpg`,
  },
  {
    id: "apple",
    slug: "apple",
    name: { az: "Apple", ru: "Apple" },
    image: `${media}/Apple-23-09.png`,
  },
  {
    id: "smartphones",
    slug: "smartfonlar",
    name: { az: "Smartfonlar", ru: "Смартфоны" },
    image: `${media}/smartfonlar-23-09.png`,
    featured: true,
  },
  {
    id: "together",
    slug: "birlikde-al",
    name: { az: "Birlikdə al", ru: "Покупай вместе" },
    image: `${media}/1-1-23-09.png`,
  },
  {
    id: "gaming",
    slug: "geymerler",
    name: { az: "Geymerlər üçün məhsullar", ru: "Товары для геймеров" },
    image: `${media}/geymerler-ucun-23-09.png`,
  },
  {
    id: "coffee",
    slug: "first-coffee",
    name: { az: "First Coffee", ru: "First Coffee" },
    image: `${media}/First_coffee-23-09.png`,
  },
  {
    id: "gadgets",
    slug: "smart-qadjetler",
    name: { az: "Smart qadjetlər", ru: "Cмарт гаджеты" },
    image: `${media}/smart-qadjet-23-09.png`,
  },
  {
    id: "notebooks",
    slug: "notbuklar",
    name: { az: "Notbuk və kompüterlər", ru: "Ноутбуки и компьютеры" },
    image: `${media}/notbuklar-23-09.png`,
    featured: true,
  },
  {
    id: "tv",
    slug: "tv-audio",
    name: { az: "TV, audio və video", ru: "ТВ, аудио и видео" },
    image: `${media}/tv-audio-23-09.png`,
    featured: true,
  },
  {
    id: "home",
    slug: "ev-texnikasi",
    name: { az: "Ev texnikası", ru: "Техника для дома" },
    image: `${media}/ev-texnikasi-23-09.png`,
    featured: true,
  },
  {
    id: "kitchen",
    slug: "metbex-texnikasi",
    name: { az: "Mətbəx texnikası", ru: "Техника для кухни" },
    image: `${media}/metbex-texnikasi-23-09.png`,
    featured: true,
  },
  {
    id: "dishes",
    slug: "qab-qacaq",
    name: { az: "Qab-qacaq", ru: "Посуда" },
    image: `${media}/qab-qacag-23-09.png`,
  },
  {
    id: "beauty",
    slug: "gozellik",
    name: { az: "Gözəllik, sağlamlıq, baxım", ru: "Красота и здоровье" },
    image: `${media}/gozellik-ve-gulluq-23-09.png`,
  },
  {
    id: "furniture",
    slug: "mebel",
    name: { az: "Mebel və tekstil", ru: "Мебель и текстиль" },
    image: `${media}/mebel-23-09.png`,
  },
  {
    id: "transport",
    slug: "neqliyyat",
    name: { az: "Nəqliyyat", ru: "Транспорт" },
    image: `${media}/neqliyyat-23-09.png`,
  },
  {
    id: "sport",
    slug: "idman",
    name: { az: "İdman və əyləncə", ru: "Спорт и отдых" },
    image: `${media}/idman-eylence-23-09.png`,
  },
  {
    id: "kids",
    slug: "usaq-alemi",
    name: { az: "Uşaq aləmi", ru: "Детский мир" },
    image: `${media}/usag-alemi-23-09.png`,
  },
  {
    id: "pets",
    slug: "ev-heyvanlari",
    name: { az: "Ev heyvanları üçün məhsullar", ru: "Товары для животных" },
    image: `${media}/ev-heyvanlari-23-09.png`,
  },
  {
    id: "repair",
    slug: "temir-tikinti",
    name: { az: "Təmir tikinti", ru: "Ремонт и строительство" },
    image: `${media}/temir-tikinti-23-09.png`,
  },
  {
    id: "garden",
    slug: "ev-ve-bag",
    name: { az: "Ev və bağ", ru: "Дом и сад" },
    image: `${media}/ev-ve-bag-23-09.png`,
  },
  {
    id: "fashion",
    slug: "geyim",
    name: { az: "Geyim aksesuarları", ru: "Одежда и аксессуары" },
    image: `${media}/geyim-ve-akks-23-09.png`,
  },
  {
    id: "services",
    slug: "xidmetler",
    name: { az: "Xidmətlər, abunəlik və soft", ru: "Услуги и подписки" },
    image: `${media}/xidmetler-23-09.png`,
  },
  {
    id: "certificates",
    slug: "hediyye-sertifikatlari",
    name: { az: "Hədiyyə sertifikatları", ru: "Подарочные сертификаты" },
    image: `${media}/kuponlar-23-09.png`,
  },
];

export const quickCategories = categories.slice(0, 8);
