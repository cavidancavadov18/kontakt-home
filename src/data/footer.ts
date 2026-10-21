export type FooterLink = {
  az: string;
  ru: string;
  href: string;
  external?: boolean;
};

export type FooterChip = {
  az: string;
  ru: string;
  href: string;
};

export const footerKontakt: FooterLink[] = [
  { az: "Şirkət haqqında", ru: "О компании", href: "/sirket-haqqinda" },
  {
    az: "Karyera",
    ru: "Карьера",
    href: "https://jobs.glorri.az/companies/abc-telecom",
    external: true,
  },
  {
    az: "«Qarabağ» proqramı",
    ru: "Программа «Карабах»",
    href: "/qarabag-proqrami",
  },
  {
    az: "Kontakt Video",
    ru: "Kontakt Video",
    href: "https://www.youtube.com/channel/UCf8uNO6TqBobRSWzBl9HPAA",
    external: true,
  },
  { az: "Bloq", ru: "Блог", href: "/blog" },
];

export const footerSupport: FooterLink[] = [
  {
    az: "Çatdırılma və ödəmə",
    ru: "Доставка и оплата",
    href: "/catdirilma-ve-odeme",
  },
  {
    az: "Geri qaytarma",
    ru: "Возврат",
    href: "/geri-qaytarma-siyaseti",
  },
  {
    az: "Hissə-hissə ödəniş",
    ru: "Рассрочка",
    href: "/hisse-hisse-odenis-sertleri",
  },
  {
    az: "Saytdan istifadə şərtləri",
    ru: "Условия использования",
    href: "/saytin-istifade-sertleri",
  },
  {
    az: "Konfidensiallıq siyasəti",
    ru: "Политика конфиденциальности",
    href: "/konfidensialliq-siyaseti",
  },
  { az: "Zəmanətlər", ru: "Гарантии", href: "/zemanetler" },
  { az: "Tez-tez verilən suallar", ru: "Частые вопросы", href: "/faq" },
];

export const footerServices: FooterLink[] = [
  { az: "Trade-in", ru: "Trade-in", href: "/trade-in" },
  { az: "2 saata qapında", ru: "За 2 часа у двери", href: "/2-saata-qapinda" },
  { az: "Promokodlar", ru: "Промокоды", href: "/promokodlar" },
  {
    az: "120% qiymətə zəmanət",
    ru: "Гарантия цены 120%",
    href: "/120-faiz-qiymete-zemanet",
  },
  {
    az: "Al, yoxla, 7 günə dəyiş",
    ru: "Купи, проверь, обменяй за 7 дней",
    href: "/al-yoxla-7-gune-deyis",
  },
  {
    az: "Korporativ satışlar",
    ru: "Корпоративные продажи",
    href: "/korporativ-satislar",
  },
];

export const footerSocial = [
  {
    id: "facebook",
    href: "https://www.facebook.com/Kontakthome/",
    label: "Facebook",
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/kontakt_home/?hl=en/",
    label: "Instagram",
  },
  {
    id: "youtube",
    href: "https://www.youtube.com/channel/UCf8uNO6TqBobRSWzBl9HPAA",
    label: "YouTube",
  },
  {
    id: "whatsapp",
    href: "https://wa.me/994508286060",
    label: "WhatsApp",
  },
  {
    id: "telegram",
    href: "https://t.me/kontakt_az",
    label: "Telegram",
  },
  {
    id: "tiktok",
    href: "https://www.tiktok.com/@kontakt_home",
    label: "TikTok",
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/company/kontakthome",
    label: "LinkedIn",
  },
] as const;

/** Real kontakt.az footer category chips → local routes */
export const footerChips: FooterChip[] = [
  { az: "Smartfonlar", ru: "Смартфоны", href: "/kataloq/smartfonlar" },
  {
    az: "iPhone 18 pro",
    ru: "iPhone 18 pro",
    href: "/axtaris?q=iPhone%2018%20pro",
  },
  {
    az: "iPhone 18 pro max",
    ru: "iPhone 18 pro max",
    href: "/axtaris?q=iPhone%2018%20pro%20max",
  },
  { az: "Kondisionerlər", ru: "Кондиционеры", href: "/kataloq/kondisionerler" },
  {
    az: "iPhone 17 pro",
    ru: "iPhone 17 pro",
    href: "/axtaris?q=iPhone%2017%20pro",
  },
  { az: "Samsung S26", ru: "Samsung S26", href: "/axtaris?q=Samsung%20S26" },
  {
    az: "Samsung S26 FE",
    ru: "Samsung S26 FE",
    href: "/axtaris?q=Samsung%20S26%20FE",
  },
  {
    az: "Kombi sistemləri",
    ru: "Комби-системы",
    href: "/kataloq/evini-qisa-hazirla",
  },
  { az: "Qızdırıcılar", ru: "Обогреватели", href: "/kataloq/evini-qisa-hazirla" },
  {
    az: "Hədiyyə sertifikatları",
    ru: "Подарочные сертификаты",
    href: "/kataloq/hediyye-sertifikatlari",
  },
  { az: "Xidmətlər", ru: "Услуги", href: "/kataloq/xidmetler" },
  {
    az: "Qəhvəbişirənlər",
    ru: "Кофемашины",
    href: "/kataloq/qehvebisirenler",
  },
  { az: "Planşetlər", ru: "Планшеты", href: "/kataloq/plansetler" },
  { az: "Oyun notbuku", ru: "Игровой ноутбук", href: "/kataloq/geymerler" },
  { az: "İş notbuku", ru: "Рабочий ноутбук", href: "/kataloq/notbuklar" },
  { az: "AirPods", ru: "AirPods", href: "/axtaris?q=AirPods" },
  {
    az: "Avtomobil məhsulları",
    ru: "Автотовары",
    href: "/kataloq/neqliyyat",
  },
  {
    az: "Avtomobil təkərləri",
    ru: "Автошины",
    href: "/kataloq/neqliyyat",
  },
  {
    az: "Elektrosamokatlar",
    ru: "Электросамокаты",
    href: "/kataloq/neqliyyat",
  },
  { az: "Velosipedlər", ru: "Велосипеды", href: "/kataloq/neqliyyat" },
  {
    az: "PlayStation 5",
    ru: "PlayStation 5",
    href: "/axtaris?q=PlayStation%205",
  },
  { az: "Dyson", ru: "Dyson", href: "/axtaris?q=Dyson" },
  { az: "iPhone 15", ru: "iPhone 15", href: "/axtaris?q=iPhone%2015" },
  { az: "Notbuklar", ru: "Ноутбуки", href: "/kataloq/notbuklar" },
  { az: "Samsung", ru: "Samsung", href: "/axtaris?q=Samsung" },
  {
    az: "Robot tozsoranlar",
    ru: "Роботы-пылесосы",
    href: "/kataloq/robot-tozsoranlar",
  },
  { az: "iPhone 16", ru: "iPhone 16", href: "/axtaris?q=iPhone%2016" },
  { az: "HONOR", ru: "HONOR", href: "/axtaris?q=HONOR" },
  { az: "Tozsoranlar", ru: "Пылесосы", href: "/kataloq/tozsoranlar" },
  {
    az: "Paltaryuyanlar",
    ru: "Стиральные машины",
    href: "/kataloq/paltaryuyanlar",
  },
  {
    az: "Samsung A57",
    ru: "Samsung A57",
    href: "/axtaris?q=Samsung%20A57",
  },
  { az: "Soyuducular", ru: "Холодильники", href: "/kataloq/metbex-texnikasi" },
  { az: "Televizorlar", ru: "Телевизоры", href: "/kataloq/tv-audio" },
  { az: "Qulaqlıqlar", ru: "Наушники", href: "/kataloq/smart-qadjetler" },
  { az: "Smart saatlar", ru: "Смарт-часы", href: "/kataloq/smart-qadjetler" },
  { az: "Mebel", ru: "Мебель", href: "/kataloq/mebel" },
  {
    az: "Qabyuyanlar",
    ru: "Посудомоечные",
    href: "/kataloq/qabyuyanlar",
  },
  { az: "Qab-qacaq", ru: "Посуда", href: "/kataloq/qab-qacaq" },
  {
    az: "Telefon aksesuarları",
    ru: "Аксессуары для телефонов",
    href: "/kataloq/smartfonlar",
  },
  { az: "Tekstil", ru: "Текстиль", href: "/kataloq/tekstil" },
  { az: "Divan və kreslo", ru: "Диваны и кресла", href: "/kataloq/mebel" },
];
