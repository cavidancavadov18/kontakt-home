export type LocaleText = { az: string; ru: string };

export type InfoBlock = {
  heading?: LocaleText;
  paragraphs?: LocaleText[];
  bullets?: LocaleText[];
};

export type InfoContact = {
  label: LocaleText;
  href?: string;
};

export type InfoPage = {
  slug: string;
  title: LocaleText;
  banners?: string[];
  images?: string[];
  logos?: string[];
  logosTitle?: LocaleText;
  contacts?: InfoContact[];
  blocks: InfoBlock[];
};

const W = "https://api.kontakt.az/media/wysiwyg";

const corporateLogos = [
  `${W}/Basqal_1.png`,
  `${W}/Marxal_1.png`,
  `${W}/Shabran_1.png`,
  `${W}/Aztelekom_1.png`,
  `${W}/Baktelecom_1.png`,
  `${W}/Yelo_2.png`,
  `${W}/Unibank_1.png`,
  `${W}/UBOC_1.png`,
  `${W}/AccessBank_1.png`,
  `${W}/Stp_1.png`,
  `${W}/ADY_1.png`,
  `${W}/ARAZ_1.png`,
  `${W}/Millikart_1.png`,
  `${W}/Workplace_1.png`,
  `${W}/Kristal_1.png`,
  `${W}/Papa_Johns_1.png`,
  `${W}/Veys_lo_lu_1.png`,
  `${W}/Improtex_1.png`,
  `${W}/Tabaterra_1.png`,
  `${W}/Pashakapital_1.png`,
  `${W}/Azza_2.png`,
  `${W}/Sirab_1.png`,
  `${W}/Rossman_1.png`,
  `${W}/_zs_t_1.png`,
  `${W}/Agro-West_1.png`,
  `${W}/Azercell_1.png`,
  `${W}/AzFinance_1.png`,
  `${W}/Coca-cola_2.png`,
  `${W}/PFL_2.png`,
];

export const infoPages: InfoPage[] = [
  {
    slug: "korporativ-satislar",
    title: { az: "Korporativ satışlar", ru: "Корпоративные продажи" },
    banners: [
      `${W}/Artboard_1_copy_44_1x_1-2_1.png`,
      `${W}/SevindirenAz.png`,
    ],
    logos: corporateLogos,
    logosTitle: { az: "Partnyorlarımız:", ru: "Наши партнёры:" },
    contacts: [
      {
        label: {
          az: "Telefon: +994 10 260 74 32",
          ru: "Телефон: +994 10 260 74 32",
        },
        href: "tel:+994102607432",
      },
      {
        label: {
          az: "E-poçt: corporate-sales@abc-telecom.az",
          ru: "Email: corporate-sales@abc-telecom.az",
        },
        href: "mailto:corporate-sales@abc-telecom.az",
      },
    ],
    blocks: [
      {
        paragraphs: [
          {
            az: "Biz müxtəlif növ yüksək keyfiyyətli rəqəmsal və məişət texnikasının, həmçinin mebellərin pərakəndə satışını həyata keçirməklə yanaşı korporativ müştərilərlə əməkdaşlığa xüsusi diqqət yetiririk. Hal-hazırda 2000-dən çox korporativ müştəri sayı ilə nəinki Azərbaycan bazarında, hətta Qafqazda da qısa müddət ərzində lider mövqelərdən birini tutmağı bacarmışıq.",
            ru: "Помимо розничной продажи цифровой и бытовой техники, а также мебели мы уделяем особое внимание корпоративным клиентам. Сегодня у нас более 2000 корпоративных партнёров — одно из лидирующих положений на рынке Азербайджана и Кавказа.",
          },
          {
            az: "Korporativ sahədə fərdi yanaşma prinsipi ilə hərəkət edirik və partnyor şirkətlər üçün eksklüziv şərtlərlə əməkdaşlıq təkliflərimiz aşağıdakı kimidir:",
            ru: "В корпоративном сегменте работаем по принципу индивидуального подхода. Эксклюзивные условия для партнёров:",
          },
        ],
        bullets: [
          {
            az: "Əməkdaşlıq etdiyimiz şirkətlər üçün xüsusi endirimli qiymətlər;",
            ru: "Специальные цены со скидкой для компаний-партнёров;",
          },
          {
            az: "Korporativ müştərilərə kreditlə satış xidməti;",
            ru: "Продажа в кредит для корпоративных клиентов;",
          },
          {
            az: "Əməkdaşlıq müddətində ödənişlərini köçürmə yolu ilə edə bilmək imkanı;",
            ru: "Возможность оплаты банковским переводом в период сотрудничества;",
          },
          {
            az: "Telefon, notbuk, kondisioner, mikrodalğalı soba və bu kimi digər elektrotexnika vasitələrinin təmini;",
            ru: "Поставка телефонов, ноутбуков, кондиционеров, СВЧ и другой электротехники;",
          },
          {
            az: "Dispenser, printer və bu kimi ofis avadanlıqlarını əldə etmək imkanı;",
            ru: "Возможность приобретения диспенсеров, принтеров и другой офисной техники;",
          },
          {
            az: "Saytımızda əks olunan məhsullarla yanaşı, orada mövcud olmayan məhsulları belə öncədən sifarişlə əldə edə bilmə imkanı.",
            ru: "Возможность предварительного заказа даже товаров, которых нет на сайте.",
          },
        ],
      },
      {
        paragraphs: [
          {
            az: "Bizimlə əməkdaşlıq etmək üçün aşağıdakı əlaqə vasitələrindən sizə uyğun olanını seçə bilərsiniz:",
            ru: "Для сотрудничества выберите удобный способ связи:",
          },
        ],
      },
    ],
  },
  {
    slug: "trade-in",
    title: { az: "Trade-in", ru: "Trade-in" },
    blocks: [
      {
        heading: {
          az: "Köhnəni gətir, yenisini pulsuz apar! Trade-in nədir?",
          ru: "Принеси старое — унеси новое бесплатно! Что такое Trade-in?",
        },
        paragraphs: [
          {
            az: "Trade-In — köhnə smartfonunu Kontakt-a təhvil verərək onun dəyəri müqabilində xüsusi endirim qazanmaq xidmətidir. Bir növ köhnə cihazın sənin üçün yeni alış-verişdə nağd pul əvəzidir.",
            ru: "Trade-In — услуга, при которой вы сдаёте старый смартфон в Kontakt и получаете скидку на новую покупку на сумму его оценки.",
          },
        ],
      },
      {
        heading: {
          az: "Qiymətləndirmə necə aparılır?",
          ru: "Как проходит оценка?",
        },
        paragraphs: [
          {
            az: "Qiymətləndirmə birbaşa mağazalarımızda keçirilir. Proses belə baş tutur:",
            ru: "Оценка проходит прямо в наших магазинах:",
          },
        ],
        bullets: [
          {
            az: "Cihazını sənə ən yaxın Kontakt mağazasına gətirirsən.",
            ru: "Приносите устройство в ближайший магазин Kontakt.",
          },
          {
            az: "Əməkdaşlarımız yerindəcə, cəmi bir neçə dəqiqə ərzində cihazın ekranını, batareyasını və digər funksiyalarını yoxlayır.",
            ru: "Сотрудники за несколько минут проверяют экран, батарею и другие функции.",
          },
          {
            az: "Cihazının işlək vəziyyətinə və bazar dəyərinə uyğun olaraq real qiymət təyin olunur və həmin məbləğ elə o andaca yeni alacağın məhsulun qiymətindən çıxılır.",
            ru: "Назначается реальная цена и сразу вычитается из стоимости нового товара.",
          },
        ],
      },
      {
        heading: {
          az: "Köhnə smartfonunu verib hansı məhsulları almaq olar?",
          ru: "Что можно купить?",
        },
        paragraphs: [
          {
            az: "Köhnə cihazını gətirib sadəcə yeni telefon yox, Kontakt-da gördüyün istənilən məhsulu seçə bilərsən. Seçim tam azaddır:",
            ru: "Можно выбрать не только новый телефон, а любой товар в Kontakt:",
          },
        ],
        bullets: [
          {
            az: "Ən son model smartfonlar, planşetlər və noutbuklar",
            ru: "Смартфоны, планшеты и ноутбуки последних моделей",
          },
          {
            az: "Böyük və kiçik məişət texnikası (soyuducu, paltaryuyan, qəhvəbişirən, airfryer və s.)",
            ru: "Крупная и мелкая бытовая техника",
          },
          {
            az: "Evini yeniləyəcək rahat mebellər və tekstil məhsulları",
            ru: "Мебель и текстиль",
          },
          {
            az: "Hətta qab-qacaq və aksesuarlar",
            ru: "Даже посуда и аксессуары",
          },
        ],
      },
      {
        heading: { az: "Tamamilə PULSUZ APAR!", ru: "Унеси полностью БЕСПЛАТНО!" },
        paragraphs: [
          {
            az: "Əgər gətirdiyin köhnə cihazın qiymətləndirmə məbləği seçdiyin yeni məhsulun qiymətinə bərabər və ya ondan çox olarsa, kassaya 0 AZN ödəyirsən. Yeni məhsulu tamamilə pulsuz götürüb gedirsən.",
            ru: "Если оценка старого устройства равна или выше цены нового товара, вы платите 0 AZN.",
          },
          {
            az: "Nümunə: köhnə iPhone 13 mağazada 500 AZN dəyərləndirilir; Bosch paltaryuyan 1200 AZN — siz yalnız 700 AZN fərqi ödəyirsiniz (nağd və ya hissə-hissə).",
            ru: "Пример: старый iPhone 13 оценён в 500 AZN; стиральная машина Bosch 1200 AZN — вы доплачиваете только 700 AZN.",
          },
        ],
      },
      {
        heading: {
          az: "«Trade-in»in üstünlükləri",
          ru: "Преимущества Trade-in",
        },
        bullets: [
          {
            az: "Məhdudiyyət yoxdur: Telefon verib soyuducu, yataq dəsti və ya təzə smartfon ala bilərsən.",
            ru: "Без ограничений по категории товара.",
          },
          {
            az: "Vaxta qənaət: Elana qoyub müştəri axtarmağa ehtiyac yoxdur.",
            ru: "Экономия времени — не нужно искать покупателя.",
          },
          {
            az: "Şəffaf və təhlükəsiz: Qiymətləndirmə gözünün qabağında aparılır.",
            ru: "Прозрачная оценка на месте.",
          },
          {
            az: "Təbiətə dəstək: Köhnə cihaz təkrar emala yönləndirilir.",
            ru: "Поддержка экологии через переработку.",
          },
        ],
      },
      {
        heading: { az: "Bunu da unutma", ru: "Важно помнить" },
        bullets: [
          {
            az: "Telefon bloklanmamış (iCloud, Mi Account və s.) və orijinal olmalıdır.",
            ru: "Телефон должен быть разблокирован и оригинальным.",
          },
          {
            az: "Ekrandakı dərin cızıqlar, əziklər və ya daxili nasazlıqlar qiymətə təsir edir.",
            ru: "Глубокие царапины, вмятины и неисправности влияют на оценку.",
          },
        ],
      },
    ],
  },
  {
    slug: "sirket-haqqinda",
    title: { az: "Şirkət haqqında", ru: "О компании" },
    blocks: [
      {
        heading: { az: "Biz kimik?", ru: "Кто мы?" },
        paragraphs: [
          {
            az: "Kontakt – texnologiyalar və pərakəndə ticarət sahəsində etibarlı və dayanıqlı oyunçu kimi tanınan aparıcı Azərbaycan şirkəti ABC-Telecom-un tərkibinə daxildir. Belə güclü bir strukturun dəstəyi inkişaf strategiyamızın, xidmət keyfiyyətimizin və müştərilərimizlə partnyorlarımızın bizə göstərdiyi yüksək etimadın əsasını təşkil edir.",
            ru: "Kontakt входит в состав ведущей азербайджанской компании ABC-Telecom — надёжного игрока в сфере технологий и ритейла.",
          },
          {
            az: "Hər bir böyük biznes hekayəsi kimi bizim hekayəmiz də müştəridən, yəni səndən başlayır. Əsas məqsədimiz ən yaxşı xidmət göstərməklə səni sevindirməkdir. «Kontakt – Sevindirir» ifadəsini də məhz bunun üçün özümüzə sloqan olaraq seçmişik.",
            ru: "Наша история начинается с клиента. Слоган: «Kontakt — радует».",
          },
        ],
      },
      {
        heading: {
          az: "Sevilən brendləri sənə daha yaxın gətiririk",
          ru: "Любимые бренды ближе к вам",
        },
        paragraphs: [
          {
            az: "Biz Samsung, LG, Bosch, Tefal, Huawei, Sony, Panasonic, Delonghi Group, Electrolux, Thomas, Beurer, Bang & Olufsen, Karcher, Beko və digər 40-dan çox beynəlxalq brendin rəsmi distribütoru; Oppo, Toshiba, Intel, Black&Decker, Hoffmann və digərlərinin eksklüziv distribütoru; Apple brendinin isə rəsmi satış mərkəziyik.",
            ru: "Официальный дистрибьютор более 40 международных брендов; эксклюзивный дистрибьютор ряда марок; официальный центр продаж Apple.",
          },
          {
            az: "İş, dərs, ev, əyləncə və istirahət üçün arzuladığın məhsulların 30 000-dən çox çeşidini «Kontakt» mağazalarımızda tapa bilərsən. Məhsullara 3 ilədək rəsmi zəmanət təqdim edirik. Suallar üçün: *6060.",
            ru: "Более 30 000 позиций ассортимента. Официальная гарантия до 3 лет. Вопросы: *6060.",
          },
        ],
      },
    ],
  },
  {
    slug: "catdirilma-ve-odeme",
    title: { az: "Çatdırılma və ödəmə", ru: "Доставка и оплата" },
    blocks: [
      {
        heading: { az: "Çatdırılma", ru: "Доставка" },
        bullets: [
          {
            az: "Çatdırılma göstərilən ünvana saat 10:00–18:00 aralığında həyata keçirilir.",
            ru: "Доставка по указанному адресу с 10:00 до 18:00.",
          },
          {
            az: "Kuryer yola düşməzdən təxminən 1 saat əvvəl müştəriyə məlumat verir.",
            ru: "Курьер уведомляет примерно за 1 час до выезда.",
          },
          {
            az: "Sifariş məbləği 50 AZN-ə qədər olduqda çatdırılma 3 AZN; 50 AZN-dən yuxarı — ödənişsizdir.",
            ru: "До 50 AZN доставка стоит 3 AZN; свыше 50 AZN — бесплатно.",
          },
        ],
      },
      {
        heading: { az: "Çatdırılma müddəti", ru: "Сроки доставки" },
        bullets: [
          {
            az: "Bakı — kiçik sifarişlər (anbarda varsa) 14:30-a qədər həmin gün.",
            ru: "Баку — мелкие заказы (если на складе) до 14:30 в тот же день.",
          },
          {
            az: "Sumqayıt, Xırdalan — kiçik sifarişlər növbəti gün.",
            ru: "Сумгаит, Хырдалан — мелкие заказы на следующий день.",
          },
          {
            az: "Regionlar — mövcudluqdan asılı olaraq 5 günədək.",
            ru: "Регионы — до 5 дней в зависимости от наличия.",
          },
        ],
      },
      {
        heading: { az: "Ödəniş üsulları", ru: "Способы оплаты" },
        bullets: [
          {
            az: "Bank kartı ilə onlayn ödəniş; Apple Pay və Google Pay",
            ru: "Онлайн картой; Apple Pay и Google Pay",
          },
          {
            az: "Kontakt-dan hissə-hissə ödəniş",
            ru: "Рассрочка от Kontakt",
          },
          {
            az: "KapitalBank, Unibank, Leobank, ABB, Bank of Baku, Yapı Kredi taksit kartları",
            ru: "Карты рассрочки KapitalBank, Unibank, Leobank, ABB, Bank of Baku, Yapı Kredi",
          },
          {
            az: "Təhvil alarkən nağd və ya kartla ödəniş",
            ru: "Наличные или карта при получении",
          },
        ],
      },
    ],
  },
  {
    slug: "geri-qaytarma-siyaseti",
    title: { az: "Geri qaytarma siyasəti", ru: "Политика возврата" },
    blocks: [
      {
        paragraphs: [
          {
            az: "Mağazamız «İstehlakçı hüquqlarının qorunması haqqında» Qanuna uyğun fəaliyyət göstərir. Qüsurlu məhsulu zəmanət müddətində geri qaytara və ya dəyişdirə bilərsən.",
            ru: "Мы работаем в соответствии с Законом «О защите прав потребителей».",
          },
        ],
      },
      {
        heading: {
          az: "Şəxsi istək əsasında (30 gün)",
          ru: "По собственному желанию (30 дней)",
        },
        bullets: [
          {
            az: "İstifadə olunmayıb, izlər yoxdur; ticarət görünüşü saxlanılıb",
            ru: "Не использовался, без следов; сохранён товарный вид",
          },
          {
            az: "Zavod qablaşdırması və tam komplektasiya",
            ru: "Заводская упаковка и полная комплектация",
          },
          {
            az: "Elektronika üçün proqramlar quraşdırılmayıb / aktivləşdirilməyib",
            ru: "Для электроники — без установки ПО и активации",
          },
          {
            az: "Ödənişi təsdiq edən sənəd mövcuddur",
            ru: "Есть документ, подтверждающий оплату",
          },
        ],
        paragraphs: [
          {
            az: "Prosedur: *6060-a zəng et → Kontakt mağazasına yaxınlaş → ekspert yoxlaması. Nağdsız ödənişdə geri qaytarma bank tərəfindən adətən 3–14 iş günü çəkir.",
            ru: "Процедура: звонок *6060 → визит в магазин → проверка экспертом.",
          },
        ],
      },
    ],
  },
  {
    slug: "zemanetler",
    title: { az: "Zəmanətlər", ru: "Гарантии" },
    blocks: [
      {
        paragraphs: [
          {
            az: "Kontakt-da məhsulların əksəriyyətinə istehsalçı zəmanəti və əlavə Qızıl Zəmanət / Zəmanət+ paketləri təqdim olunur.",
            ru: "На большинство товаров действует гарантия производителя, а также пакеты «Золотая гарантия» и «Гарантия+».",
          },
        ],
      },
      {
        heading: {
          az: "Qızıl Zəmanət Ultra (Rəqəmsal)",
          ru: "Золотая гарантия Ultra (Цифровая)",
        },
        bullets: [
          {
            az: "İstifadə nəticəsində yaranan qüsurlar zəmanət müddətində pulsuz təmir (14 günədək)",
            ru: "Бесплатный ремонт дефектов от использования (до 14 дней)",
          },
          {
            az: "Maye keçməsi, açıq alov, virus halları da əhatə olunur",
            ru: "Включает попадание жидкости, огонь, вирусы",
          },
          {
            az: "Təmir 14 günü keçərsə — 100% dəyərdə yenisi",
            ru: "Если ремонт дольше 14 дней — новый товар на 100% стоимости",
          },
          {
            az: "Güzəştli dəyişdirmə: 1-ci ay 100%, 2–3-cü ay 75%, sonra azalan faizlər",
            ru: "Льготный обмен: 1-й месяц 100%, 2–3-й 75%, далее по шкале",
          },
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: {
      az: "Tez-tez verilən suallar",
      ru: "Частые вопросы",
    },
    blocks: [
      {
        heading: {
          az: "Sifarişi necə vermək olar?",
          ru: "Как оформить заказ?",
        },
        paragraphs: [
          {
            az: "Səbət vasitəsilə «Sifarişi rəsmiləşdir», LiveChat, *6060 telefon və ya məhsul səhifəsində «1 kliklə al» — operator sifarişi təsdiqləyəcək.",
            ru: "Через корзину, LiveChat, телефон *6060 или «Купить в 1 клик».",
          },
        ],
      },
      {
        heading: {
          az: "Hansı ödəniş üsulları var?",
          ru: "Какие способы оплаты?",
        },
        paragraphs: [
          {
            az: "Nağdsız (kart, Apple/Google Pay), nağd, Kontakt hissə-hissə ödəniş və bank taksit kartları.",
            ru: "Безнал, наличные, рассрочка Kontakt и банковские карты рассрочки.",
          },
        ],
      },
      {
        heading: { az: "Çatdırılma müddəti?", ru: "Срок доставки?" },
        paragraphs: [
          {
            az: "Bakı, Sumqayıt, Xırdalan — adətən 2 iş günü; uzaq bölgələr — 3–14 gün.",
            ru: "Баку, Сумгаит, Хырдалан — обычно 2 рабочих дня; регионы — 3–14 дней.",
          },
        ],
      },
      {
        heading: {
          az: "Hissəli alış şərtləri?",
          ru: "Условия рассрочки?",
        },
        paragraphs: [
          {
            az: "18+ yaş, yalnız şəxsiyyət vəsiqəsi. Ödənişlər mağazada, terminallarda və bank tətbiqlərində mümkündür.",
            ru: "18+, только удостоверение личности. Оплаты — в магазине, терминалах и приложениях банков.",
          },
        ],
      },
    ],
  },
  {
    slug: "hisse-hisse-odenis-sertleri",
    title: {
      az: "Hissə-hissə ödəniş şərtləri",
      ru: "Условия рассрочки",
    },
    images: [
      "https://api.kontakt.az/media/.renditions/wysiwyg/tabs/qr_hisse_hisse_odenish.jpg",
      "https://api.kontakt.az/media/.renditions/wysiwyg/tabs/passport_hisse_hisse_odenish.jpg",
    ],
    blocks: [
      {
        bullets: [
          { az: "Ödəniş valyutası: AZN", ru: "Валюта: AZN" },
          {
            az: "Xidmət haqqı (məişət, elektronika, mobil, mebel): 6.5–10.5%",
            ru: "Комиссия: 6.5–10.5%",
          },
          {
            az: "Yaş: 18+ Azərbaycan Respublikası vətəndaşı",
            ru: "Возраст: 18+, гражданин Азербайджана",
          },
          {
            az: "Sənəd: yalnız şəxsiyyət vəsiqəsi",
            ru: "Документ: только удостоверение личности",
          },
          {
            az: "Müddət: 24 ayadək; mebel üçün faizsiz 24 ay mümkündür",
            ru: "Срок: до 24 месяцев; для мебели возможна беспроцентная 24 мес.",
          },
        ],
        paragraphs: [
          {
            az: "Aylıq ödənişləri MilliÖn / e-manat terminallarında «Mağazalar şəbəkəsi və E-ticarət» → Kontakt, FİN kod və müqavilə nömrəsi ilə edə bilərsən. Kömək: *6060 və ya WhatsApp 050 828 60 60.",
            ru: "Ежемесячные платежи — в терминалах MilliÖn / e-manat. Помощь: *6060 или WhatsApp 050 828 60 60.",
          },
        ],
      },
    ],
  },
  {
    slug: "120-faiz-qiymete-zemanet",
    title: { az: "120% qiymətə zəmanət", ru: "Гарантия цены 120%" },
    banners: [`${W}/2720-360-aze_15.10.26_1.jpg`],
    blocks: [
      {
        paragraphs: [
          {
            az: "İstər smartfon, istər televizor, məişət texnikası, mebel və digər məhsullar – fərq etməz, ən yaxşı qiymət bizdədir! Biz qiymətə 100% yox, 120% zəmanət veririk!",
            ru: "Лучшая цена у нас! Гарантия не 100%, а 120%!",
          },
          {
            az: "İstənilən məhsulu digər rəsmi şəbəkələrdə daha ucuz tap — bizdən qiymət fərqinin 120%-nə endirim əldə et! Kampaniya nağd və taksit kartları ilə alınan məhsullara şamil olunur.",
            ru: "Найдите дешевле в другой официальной сети — получите скидку 120% от разницы!",
          },
          {
            az: "Onlayn endirim üçün «Əlavə Qeyd» bölməsində digər rəsmi şəbəkədəki məhsulun linkini göndərin.",
            ru: "Для онлайн-скидки укажите ссылку на товар в другой официальной сети в поле «Дополнительная заметка».",
          },
        ],
      },
      {
        heading: { az: "Şərtlər", ru: "Условия" },
        bullets: [
          {
            az: "Qiymət rəsmi lisenziyalı şəbəkədə qeydə alınmalıdır",
            ru: "Цена должна быть в официальной лицензированной сети",
          },
          {
            az: "Məhsul tam eyni olmalıdır (model, komplektasiya, rəng)",
            ru: "Товар должен быть полностью идентичен",
          },
          {
            az: "Yalnız yeni məhsul; vitrin / «tükənməkdə olan» istisna",
            ru: "Только новый товар",
          },
          {
            az: "Yalnız fiziki şəxslər; kampaniya müddətsizdir",
            ru: "Только физлица; акция бессрочная",
          },
        ],
      },
    ],
  },
  {
    slug: "alis-veris-et-edv-ni-geri-al",
    title: { az: "ƏDV geri al", ru: "Вернуть НДС" },
    blocks: [
      {
        heading: {
          az: "Alış-veriş et, ƏDV-ni geri al",
          ru: "Покупай — возвращай НДС",
        },
        paragraphs: [
          {
            az: "Kontakt-dan alış-veriş edəndə ƏDV-nin bir hissəsini geri ala bilərsən: kartla ödənişdə ƏDV-nin 17,5%-i, nağd ödənişdə ƏDV-nin 5%-i.",
            ru: "При оплате картой возвращается 17,5% НДС, при наличных — 5% НДС.",
          },
          {
            az: "Çekdəki fiskal ID-ni «ƏDV geri al» sisteminə əlavə et. Statusu şəxsi kabinetdən izlə; 30 gün sonra məbləğ virtual pul qabına düşür — ödənişlərdə istifadə et və ya karta köçür.",
            ru: "Добавьте фискальный ID чека в систему. Через 30 дней сумма попадёт в виртуальный кошелёк.",
          },
        ],
      },
    ],
  },
  {
    slug: "30-gune-deyis-qaytar",
    title: {
      az: "30 günə dəyiş-qaytar",
      ru: "Обмен и возврат за 30 дней",
    },
    banners: [`${W}/landing_page_2__4.png`],
    blocks: [
      {
        paragraphs: [
          {
            az: "Kontakt.az-dan onlayn alınan məhsulları 30 gün ərzində qaytarmaq və dəyişdirmək mümkündür — istifadə olunmayıb, komplekt tam, qablaşdırma pozulmayıb, sənədlər mövcuddur.",
            ru: "Товары с Kontakt.az можно вернуть или обменять в течение 30 дней при сохранении товарного вида и комплектации.",
          },
          {
            az: "Prosedur: *6060 və ya 012 310-24-24 → mağazaya yaxınlaş → ekspert yoxlaması. Böyük texnika və 32\"-dən böyük TV servisdə yoxlanılır.",
            ru: "Процедура: *6060 или 012 310-24-24 → магазин → проверка.",
          },
        ],
      },
    ],
  },
  {
    slug: "al-yoxla-7-gune-deyis",
    title: {
      az: "Al, yoxla, 7 günə dəyiş",
      ru: "Купи, проверь, обменяй за 7 дней",
    },
    blocks: [
      {
        paragraphs: [
          {
            az: "Məhsulu al, 7 gün yoxla. Qane olmasan — eyni kateqoriyadan eyni və ya daha yüksək qiymətli fərqli modellə 1 dəfə dəyiş.",
            ru: "Купите, тестируйте 7 дней. Не устроило — один раз обменяйте на другую модель той же категории.",
          },
        ],
      },
      {
        heading: { az: "Şamil edilmir", ru: "Не распространяется" },
        bullets: [
          {
            az: "Smartfon, planşet, printer, aksesuar, gigiyenik məhsullar, iqlim texnikası",
            ru: "Смартфоны, планшеты, принтеры, аксессуары, гигиена, климатическая техника",
          },
        ],
        paragraphs: [
          {
            az: "7 günlük xidmət çərçivəsində yalnız dəyişmə mümkündür — geri qaytarma yoxdur.",
            ru: "В рамках услуги возможен только обмен, не возврат.",
          },
        ],
      },
    ],
  },
  {
    slug: "2-saata-qapinda",
    title: { az: "2 saata qapında", ru: "За 2 часа у двери" },
    banners: [
      "https://kontakt.az/media/wysiwyg/2720_x_360_01.10.26_az.png",
      "https://kontakt.az/media/wysiwyg/1312x400_01.10.26.png",
    ],
    blocks: [
      {
        paragraphs: [
          {
            az: "Ekranda gördüklərin 2 SAATA QAPINDA olsun! Həm smartfon, həm bütün düyməli telefonlar SÜRƏTLİ və PULSUZ şəkildə sənə çatdırırıq. Saat 09:00-dan 18:00-dək kontakt.az saytından verdiyin sifariş rəsmiləşdirildikdən sonra 2 saat ərzində ünvana çatdırılır.",
            ru: "Смартфоны и кнопочные телефоны — быстро и бесплатно за 2 часа. Заказы с 09:00 до 18:00 доставляются в течение 2 часов после оформления.",
          },
        ],
      },
      {
        heading: {
          az: "Smartfon və düyməli telefonlar",
          ru: "Смартфоны и кнопочные телефоны",
        },
        paragraphs: [
          {
            az: "Bu xidmət smartfon və düyməli telefonlara şamil olunur. Məhsullara baxmaq üçün kataloqa keçin.",
            ru: "Услуга действует для смартфонов и кнопочных телефонов. Смотрите каталог.",
          },
        ],
      },
    ],
  },
  {
    slug: "promokodlar",
    title: { az: "Promokodlar", ru: "Промокоды" },
    banners: [`${W}/Artboard_1_copy_1_12.08.26_az_1.jpg`],
    blocks: [
      {
        paragraphs: [
          {
            az: "Promokodun var? İstifadə et və xüsusi endirimlərdən yararlan! İstər saytdan onlayn sifariş et, istərsə də mağazalarımıza yaxınlaş.",
            ru: "Есть промокод? Используйте его онлайн или в магазине.",
          },
        ],
      },
      {
        heading: {
          az: "Onlayn alış-veriş zamanı",
          ru: "При онлайн-покупке",
        },
        bullets: [
          {
            az: "SMS-lə gələn linkə klikləyərək endirimli məhsullar səhifəsinə daxil ol",
            ru: "Перейдите по ссылке из SMS на страницу товаров со скидкой",
          },
          {
            az: "«Bir kliklə al» düyməsinə bas",
            ru: "Нажмите «Купить в 1 клик»",
          },
          {
            az: "«Promokod» xanasına kodu yaz və «Tətbiq et»",
            ru: "Введите код в поле «Промокод» и нажмите «Применить»",
          },
        ],
      },
      {
        heading: { az: "Mağazada", ru: "В магазине" },
        bullets: [
          {
            az: "Nağd/kart: ödənişdən əvvəl kassirə de",
            ru: "Наличные/карта: сообщите кассиру до оплаты",
          },
          {
            az: "Hissəli: müqavilədən əvvəl satış təmsilçisinə bildir",
            ru: "Рассрочка: сообщите до заключения договора",
          },
        ],
        paragraphs: [
          {
            az: "Vacibdir: Ödəniş və ya müqavilədən sonra promokod tətbiq edilə bilməz. Promokod şəxsidir, nağd pula çevrilmir.",
            ru: "Важно: после оплаты промокод не применяется. Промокод персональный, наличными не обменивается.",
          },
        ],
      },
    ],
  },
  {
    slug: "qarabag-proqrami",
    title: { az: "«Qarabağ» Proqramı", ru: "Программа «Карабах»" },
    blocks: [
      {
        paragraphs: [
          {
            az: "Biz «Qarabağ» Proqramı çərçivəsində indiyədək:",
            ru: "В рамках программы «Карабах» мы:",
          },
        ],
        bullets: [
          {
            az: "Məcburi köçkünlər üçün «Qobu Park-3» yaşayış kompleksinin 10 mənzil inşasında iştirak etdik",
            ru: "Участвовали в строительстве 10 квартир в «Гобу Парк-3»",
          },
          {
            az: "Şəhid ailələrinin və qazilərin müharibəyə qədərki kredit borclarını ləğv etdik",
            ru: "Списали довоенные кредитные долги семей шехидов и гази",
          },
          {
            az: "14.09.2022 tarixinədək ümumilikdə 267 563 manat məbləğində borc silinib; proses davam edir",
            ru: "До 14.09.2022 списано 267 563 маната; процесс продолжается",
          },
          {
            az: "Şəhid Arəstə Baxışovanın övladlarına 20 000 manat təhsil yardımı və elektronika hədiyyə etdik",
            ru: "Детям шехида Аресты Бахышовой — 20 000 манат на образование и электроника",
          },
          {
            az: "Əməkdaşımız Aslan Rzayevin övladının təminat və təhsil xərclərini üzərimizə götürdük; ailəyə 25 000 manat yardım",
            ru: "Взяли на себя расходы на ребёнка сотрудника Аслана Рзаева; семье — 25 000 манат",
          },
        ],
      },
    ],
  },
  {
    slug: "konfidensialliq-siyaseti",
    title: {
      az: "Konfidensiallıq siyasəti",
      ru: "Политика конфиденциальности",
    },
    blocks: [
      {
        paragraphs: [
          {
            az: "Kontakt şəxsi məlumatlarınızı (ad, telefon, ünvan, sifariş tarixçəsi) yalnız sifarişin icrası, müştəri dəstəyi və qanunvericilik tələbləri üçün emal edir. Məlumatlar üçüncü tərəflərə satılmır.",
            ru: "Kontakt обрабатывает персональные данные только для исполнения заказов, поддержки и требований закона.",
          },
          {
            az: "Saytdan istifadə etməklə siyasətlə razılaşırsınız. Suallar üçün: *6060.",
            ru: "Используя сайт, вы соглашаетесь с политикой. Вопросы: *6060.",
          },
        ],
      },
    ],
  },
  {
    slug: "saytin-istifade-sertleri",
    title: {
      az: "Saytdan istifadə şərtləri",
      ru: "Условия использования сайта",
    },
    blocks: [
      {
        paragraphs: [
          {
            az: "kontakt.az saytındakı qiymətlər, kampaniyalar və stok məlumatı dəyişə bilər. Sifariş operator təsdiqindən sonra qəti hesab olunur.",
            ru: "Цены, акции и наличие могут меняться. Заказ окончателен после подтверждения оператором.",
          },
          {
            az: "Mübahisələr Azərbaycan Respublikasının qanunvericiliyinə uyğun həll edilir.",
            ru: "Споры решаются по законодательству Азербайджанской Республики.",
          },
        ],
      },
    ],
  },
];

export function getInfoPage(slug: string): InfoPage | undefined {
  return infoPages.find((p) => p.slug === slug);
}

export const infoPageSlugs = infoPages.map((p) => p.slug);
