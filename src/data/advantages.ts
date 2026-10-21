export type Advantage = {
  id: string;
  title: { az: string; ru: string };
  desc: { az: string; ru: string };
  href: string;
  /** Inline SVG path markup (from kontakt.az ups-advantages) */
  icon:
    | "medal"
    | "edv"
    | "return30"
    | "delivery"
    | "install"
    | "exchange7"
    | "warranty"
    | "original"
    | "payment";
};

export const advantages: Advantage[] = [
  {
    id: "120",
    title: { az: "Qiymətə 120% zəmanət", ru: "Гарантия цены 120%" },
    desc: {
      az: "Digər rəsmi şəbəkələrdə eyni məhsulu daha ucuz tapsan, qiymət fərqinin 120%-i qədər endirim əldə edəcəksən.",
      ru: "Найди дешевле в другой официальной сети — получи скидку до 120% разницы.",
    },
    href: "/120-faiz-qiymete-zemanet",
    icon: "medal",
  },
  {
    id: "edv",
    title: { az: "ƏDV geri al", ru: "Вернуть НДС" },
    desc: {
      az: "Ödəniş etdikdən sonra ƏDV-nin bir hissəsini geri ala bilərsən.",
      ru: "После оплаты можно вернуть часть НДС.",
    },
    href: "/alis-veris-et-edv-ni-geri-al",
    icon: "edv",
  },
  {
    id: "30day",
    title: { az: "30 gün ərzində qaytar", ru: "Возврат за 30 дней" },
    desc: {
      az: "Onlayn aldığın məhsul gözləntini qarşılamasa, 30 gün ərzində geri qaytara bilərsən.",
      ru: "Если товар не подошёл — верни в течение 30 дней.",
    },
    href: "/30-gune-deyis-qaytar",
    icon: "return30",
  },
  {
    id: "delivery",
    title: { az: "Pulsuz çatdırılma", ru: "Бесплатная доставка" },
    desc: {
      az: "Qiyməti 49.99 AZN-dən yuxarıdırsa, pulsuz çatdırılmadan yararlan.",
      ru: "Бесплатная доставка от 49.99 AZN.",
    },
    href: "/catdirilma-ve-odeme",
    icon: "delivery",
  },
  {
    id: "install",
    title: { az: "Pulsuz quraşdırma", ru: "Бесплатная установка" },
    desc: {
      az: "Mütəxəssislərimiz məhsulu təhlükəsiz quraşdırıb istifadəyə hazır vəziyyətə gətirəcək.",
      ru: "Специалисты бесплатно установят выбранные товары.",
    },
    href: "/catdirilma-ve-odeme",
    icon: "install",
  },
  {
    id: "exchange7",
    title: {
      az: "İşlət, 7 gün ərzində dəyiş",
      ru: "Пользуйся — обмен за 7 дней",
    },
    desc: {
      az: "Məişət texnikası al, istifadə et, gözləntini qarşılamasa, 7 gün ərzində dəyiş.",
      ru: "Пользуйся техникой — обменяй в течение 7 дней.",
    },
    href: "/al-yoxla-7-gune-deyis",
    icon: "exchange7",
  },
  {
    id: "warranty",
    title: { az: "Rəsmi zəmanət", ru: "Официальная гарантия" },
    desc: {
      az: "Məhsulu rəsmi zəmanətlə al və zəmanət müddətində peşəkar dəstəkdən yararlan.",
      ru: "Официальная гарантия и профессиональная поддержка.",
    },
    href: "/zemanetler",
    icon: "warranty",
  },
  {
    id: "original",
    title: { az: "Orijinal məhsullar", ru: "Оригинальные товары" },
    desc: {
      az: "Seçdiyin məhsulun orijinallığından əmin ola bilərsən. Kontakt-da yalnız orijinal məhsullar təqdim olunur.",
      ru: "В Kontakt только оригинальные товары.",
    },
    href: "/zemanetler",
    icon: "original",
  },
  {
    id: "payment",
    title: { az: "Rahat ödəniş", ru: "Удобная оплата" },
    desc: {
      az: "Sənə uyğun ödəniş üsulunu seç və alışını rahat şəkildə tamamla. Nağd, kart və digər mövcud ödəniş imkanlarından yararlana bilərsən.",
      ru: "Оплачивай удобным способом — наличные, карта и другие варианты.",
    },
    href: "/catdirilma-ve-odeme",
    icon: "payment",
  },
];
