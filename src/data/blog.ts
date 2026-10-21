import type { Locale } from "@/i18n/dictionaries";

export type BlogPost = {
  slug: string;
  title: { az: string; ru: string };
  excerpt: { az: string; ru: string };
  category: { az: string; ru: string };
  date: string;
  image: string;
  content: { az: string[]; ru: string[] };
};

export const blogPosts: BlogPost[] = [
  {
    slug: "anc-funksiyali-ve-anc-siz-tws-qulaqliqlar-qiymet-ferqine-deyermi",
    title: {
      az: "ANC funksiyalı və ANC-siz TWS qulaqlıqlar: qiymət fərqinə dəyərmi",
      ru: "TWS с ANC и без: стоит ли разница в цене",
    },
    excerpt: {
      az: "Səs-küy ləğvi gündəlik yolda və ofisdə nə qədər fərq yaradır, qiymət fərqi özünü doğruldurmu.",
      ru: "Насколько шумоподавление меняет дорогу и офис и окупается ли доплата.",
    },
    category: { az: "Qulaqlıq seçimi", ru: "Выбор наушников" },
    date: "2026-10-20",
    image:
      "https://api.kontakt.az/media/mageplaza/blog/post/p/r/premium_earbuds_on_geometric_platforms.png",
    content: {
      az: [
        "ANC (aktiv səs-küy ləğvi) mühərrik, metro və açıq ofis səsini azaldır. ANC-siz modellər daha yüngül olur və batareya daha uzun işləyir.",
        "Qiymət fərqi adətən 40–80 AZN arasındadır. Hər gün nəqliyyatda qulaqlıq taxırsınızsa, ANC özünü doğruldur. Evdə musiqi üçün isə yaxşı sürücü və rahat oturuş daha vacibdir.",
        "Kontakt-da hər iki növü mağazada yoxlamaq olar: eyni mahnını ANC açıq və bağlı rejimdə dinləyin, sonra qərar verin.",
      ],
      ru: [
        "ANC снижает шум двигателя, метро и открытого офиса. Модели без ANC легче и дольше держат заряд.",
        "Разница в цене обычно 40–80 AZN. Если наушники каждый день в дороге, ANC окупается. Для дома важнее драйвер и посадка.",
        "В Kontakt оба варианта можно сравнить в магазине: одна песня с ANC и без.",
      ],
    },
  },
  {
    slug: "macbook-air-yoxsa-macbook-pro-is-ucun-hansini-secmeli",
    title: {
      az: "MacBook Air, yoxsa MacBook Pro: iş üçün hansını seçməli",
      ru: "MacBook Air или MacBook Pro: что выбрать для работы",
    },
    excerpt: {
      az: "Ofis, montaj və proqramlaşdırma üçün Air ilə Pro arasındakı real fərq.",
      ru: "Реальная разница Air и Pro для офиса, монтажа и разработки.",
    },
    category: { az: "MacBook Seçimi", ru: "Выбор MacBook" },
    date: "2026-10-19",
    image:
      "https://api.kontakt.az/media/mageplaza/blog/post/m/o/modern_laptop_showroom_duo.png",
    content: {
      az: [
        "MacBook Air sənəd, brauzer, video zəng və yüngül proqramlaşdırma üçün kifayətdir. Çəkisi azdır, batareyası bir iş günü saxlayır.",
        "MacBook Pro uzun video montajı, 3D və eyni anda çox ağır proqram üçün fan və daha güclü çip verir. Ekran parlaqlığı da studiyada fərq yaradır.",
        "İşiniz əsasən ofis və bulud xidmətləridirsə Air daha sərfəlidir. Hər gün render və ya rəng korreksiyası varsa Pro seçin.",
      ],
      ru: [
        "MacBook Air хватает для документов, браузера, созвонов и лёгкой разработки. Он легче и держит день работы.",
        "MacBook Pro нужен для долгого монтажа, 3D и нескольких тяжёлых программ сразу. Яркость экрана тоже выше.",
        "Для офиса и облака выгоднее Air. Для ежедневного рендера берите Pro.",
      ],
    },
  },
  {
    slug: "oyun-mouse-u-klaviatura-ve-qulaqliq-secerken-edilen-5-sehv",
    title: {
      az: "Oyun mouse-u, klaviatura və qulaqlıq seçərkən edilən 5 səhv",
      ru: "5 ошибок при выборе игровой мыши, клавиатуры и гарнитуры",
    },
    excerpt: {
      az: "DPI, keçid növü və mikrofon — dəsti almazdan əvvəl yoxlanılan beş məqam.",
      ru: "DPI, тип свитчей и микрофон — пять пунктов до покупки набора.",
    },
    category: { az: "İcmal", ru: "Обзор" },
    date: "2026-10-16",
    image:
      "https://api.kontakt.az/media/mageplaza/blog/post/h/i/high-end_gaming_setup_with_mountain_display.png",
    content: {
      az: [
        "Ən yüksək DPI həmişə yaxşı deyil. Əksər oyunlar üçün 800–1600 DPI və böyük mouse pad kifayətdir.",
        "Klaviaturada keçid növünü mağazada basın: klikli mexaniki hər kəsə uyğun gəlmir. Qulaqlıqda mikrofonu səsli söhbətdə yoxlayın.",
        "Dəsti bir-bir yox, eyni masaya sığan ölçüdə seçin. Kontakt-da gaming set kartları monitorla birlikdə endirimli gəlir.",
      ],
      ru: [
        "Максимальный DPI не всегда лучше. Для большинства игр хватает 800–1600 DPI и большого коврика.",
        "Тип свитчей проверьте в магазине: кликающая механика подходит не всем. Микрофон гарнитуры проверьте в голосовом чате.",
        "Набор берите по размеру стола. В Kontakt gaming set идёт со скидкой вместе с монитором.",
      ],
    },
  },
  {
    slug: "metbex-masini-yoxsa-planetar-mikser-hansini-secmeli",
    title: {
      az: "Mətbəx maşını, yoxsa planetar mikser: hansını seçməli",
      ru: "Кухонная машина или планетарный миксер: что выбрать",
    },
    excerpt: {
      az: "Xəmir, krem və gündəlik sous üçün hansı motor və qab həcmi lazımdır.",
      ru: "Какой мотор и объём чаши нужны для теста, крема и соусов.",
    },
    category: { az: "Müqayisə", ru: "Сравнение" },
    date: "2026-10-15",
    image:
      "https://api.kontakt.az/media/mageplaza/blog/post/m/o/modern_kitchen_mixer_showcase.png",
    content: {
      az: [
        "Planetar mikser qabı dövrə vuran başlıqla xəmiri künclərdən də yığır. Həftədə bir neçə dəfə çörək və krem hazırlayırsınızsa, bu tip daha uyğundur.",
        "Klassik mətbəx maşını daha yığcamdır və əl blenderi kimi də işləyən modelləri var. Az yer olan mətbəx üçün o, daha rahatdır.",
        "Qab həcmini ailə sayına görə seçin: 4–5 litr əksər evlər üçün kifayətdir. Gücü 800 W-dan aşağı modellər sıx xəmirdə çətinlik çəkir.",
      ],
      ru: [
        "Планетарный миксер собирает тесто и со стенок чаши. Если печёте несколько раз в неделю, берите его.",
        "Классическая кухонная машина компактнее, у части моделей есть ручной блендер. Для маленькой кухни это удобнее.",
        "Объём чаши под размер семьи: 4–5 л хватает большинству. Мотор ниже 800 W тяжело месит крутое тесто.",
      ],
    },
  },
  {
    slug: "2026-ci-ilde-en-yaxsi-smartfonlar",
    title: {
      az: "2026-cı ildə alınacaq ən yaxşı smartfonlar",
      ru: "Лучшие смартфоны для покупки в 2026 году",
    },
    excerpt: {
      az: "Kamera, batareya və qiymət balansında lider modelləri müqayisə edirik — Kontakt mağazalarında test edə bilərsiniz.",
      ru: "Сравниваем лидеров по камере, автономности и цене — протестировать можно в магазинах Kontakt.",
    },
    category: { az: "Smartfonlar", ru: "Смартфоны" },
    date: "2026-03-12",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    content: {
      az: [
        "2026-cı il smartfon bazarında OLED ekranlar, 5000 mAh+ batareyalar və süni intellektə əsaslanan foto rejimləri standart halına gəlib. Əgər telefonunuzu 3–4 ildən artıq istifadə edirsinizsə, fərq göz qabağındadır.",
        "Flagman seqmentində Samsung Galaxy S seriyası və iPhone-un yeni nəsil modelləri video stabilizasiya və gece çəkilişində liderdir. Orta seqmentdə isə Redmi Note və HONOR X seriyaları yüksək refresh rate ekranı əlverişli qiymətə təklif edir.",
        "Alış-verişdən əvvəl ehtiyacınızı müəyyən edin: oyun, fotoqrafiya, yoxsa sadəcə mesajlaşma? Kontakt Home-da hər modeli əldə tutub ekranı, səs keyfiyyətini və çəkisini mağazada yoxlamaq mümkündür.",
        "Hissə-hissə ödəniş və trade-in proqramları köhnə cihazınızı endirimə çevirir. *6060 qaynar xətti və ya veb-sayt vasitəsilə stokda olan rəng və yaddaş variantlarını yoxlayın.",
      ],
      ru: [
        "В 2026 году на рынке смартфонов OLED-экраны, аккумуляторы 5000 mAh+ и AI-режимы съёмки стали нормой. Если вы пользуетесь телефоном дольше 3–4 лет, разница заметна сразу.",
        "В флагманском сегменте лидируют Samsung Galaxy S и новое поколение iPhone по стабилизации видео и ночной съёмке. В среднем сегменте Redmi Note и HONOR X дают высокий refresh rate по доступной цене.",
        "Перед покупкой определите задачи: игры, фото или только мессенджеры? В Kontakt Home можно подержать каждую модель в магазине и оценить экран, звук и вес.",
        "Рассрочка и trade-in превращают старый аппарат в скидку. Проверьте цвет и объём памяти на сайте или по горячей линии *6060.",
      ],
    },
  },
  {
    slug: "ev-ucun-energy-efficient-kondisioner",
    title: {
      az: "Ev üçün enerjiyə qənaət edən kondisioner necə seçilir?",
      ru: "Как выбрать энергоэффективный кондиционер для дома",
    },
    excerpt: {
      az: "BTU hesablaması, inverter texnologiyası və səssiz gecə rejimi — yay isti günlərində komfort üçün qısa bələdçi.",
      ru: "Расчёт BTU, инвертор и тихий ночной режим — краткий гид для комфорта в жаркие дни.",
    },
    category: { az: "Ev texnikası", ru: "Бытовая техника" },
    date: "2026-02-28",
    image:
      "https://images.unsplash.com/photo-1631545806606-19c963edd089?w=800&q=80",
    content: {
      az: [
        "Kondisioner seçərkən otağın kvadraturası əsas göstəricidir: 20 m² üçün adətən 9000 BTU, 30 m² üçün 12000 BTU kifayət edir. Kontakt kataloqunda hər modelin tövsiyə olunan sahəsi göstərilir.",
        "Inverter kompressor enerji sərfini 30–40% azaldır və temperaturu daha sabit saxlayır. A++ və daha yüksək sinifli cihazlar uzunmüddətli istifadədə elektrik hesab-fakturasında fərq yaradır.",
        "Səssiz rejim uşaq otağı və yataq otağı üçün vacibdir — 20 dB-a yaxın səviyyəli modellər gecə yuxusunu pozmur. Filtrlərin asan çıxarılması təmizlik üçün əlavə üstünlükdür.",
        "Peşəkar quraşdırma zəmanətin qorunması üçün şərtdir. Kontakt Home çatdırılma və quraşdırma xidməti göstərir; mövsüm endirimlərini kampaniyalar bölməsində izləyin.",
      ],
      ru: [
        "При выборе кондиционера главное — площадь комнаты: для 20 m² обычно хватает 9000 BTU, для 30 m² — 12000 BTU. В каталоге Kontakt указана рекомендуемая площадь для каждой модели.",
        "Инверторный компрессор снижает потребление на 30–40% и стабильнее держит температуру. Класс A++ и выше окупается при длительной эксплуатации.",
        "Тихий режим важен для детской и спальни — модели около 20 dB не мешают сну. Съёмные фильтры упрощают уход.",
        "Профессиональный монтаж нужен для сохранения гарантии. Kontakt Home доставляет и устанавливает; сезонные скидки — в разделе акций.",
      ],
    },
  },
  {
    slug: "televizor-oled-yoxsa-qled",
    title: {
      az: "Televizor alarkən: OLED, QLED və ya Mini LED?",
      ru: "Телевизор: OLED, QLED или Mini LED?",
    },
    excerpt: {
      az: "Otaq işığı, oyun və idman translyasiyası üçün hansı panel texnologiyası daha uyğundur?",
      ru: "Какая технология панели лучше для освещения комнаты, игр и спортивных трансляций?",
    },
    category: { az: "TV və audio", ru: "TV и аудио" },
    date: "2026-02-14",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    content: {
      az: [
        "OLED hər pikseli ayrıca işıqlandırdığı üçün dərin qara və geniş baxış bucağı verir — film həvəskarları üçün ideal seçimdir. Günəş işığı olan otaqlarda parlaqlığı yoxlamaq məsləhətdir.",
        "QLED və Mini LED isə yüksək parlaqlıq və HDR kontentində üstünlük təmin edir; gündüz idman matçları və oyunlar üçün uyğundur. 120 Hz və aşağı gecikmə rejimi konsol sahibləri üçün vacibdir.",
        "Smart TV platforması (webOS, Tizen, Google TV) sevdiyiniz tətbiqlərin olub-olmadığını yoxlayın. Kontakt mağazalarında eyni kontenti müxtəlif ekranlarda müqayisə edə bilərsiniz.",
        "Divar montajı və soundbar birlikdə sifariş etmək kinoteatr effektini artırır. 120% qiymət zəmanəti kampaniyası ilə rəqib qiymətlərindən də sərfəli alış edə bilərsiniz.",
      ],
      ru: [
        "OLED даёт глубокий чёрный и широкие углы, подсвечивая каждый пиксель — отличный выбор для кино. В комнатах с солнцем стоит проверить яркость на месте.",
        "QLED и Mini LED выигрывают в яркости и HDR — подходят для дневного спорта и игр. 120 Hz и низкая задержка важны для консолей.",
        "Проверьте наличие нужных приложений на Smart TV (webOS, Tizen, Google TV). В магазинах Kontakt можно сравнить одну и ту же картинку на разных панелях.",
        "Кронштейн и саундбар усилят эффект кинотеатра. Акция «гарантия цены 120%» помогает купить выгоднее конкурентов.",
      ],
    },
  },
  {
    slug: "notbuk-is-ucun-yoxsa-oyun",
    title: {
      az: "İş notbuku və oyun notbuku — fərqlər nədir?",
      ru: "Рабочий и игровой ноутбук — в чём разница?",
    },
    excerpt: {
      az: "Prosessor, videokartа və ekran refresh rate göstəriciləri hansı tapşırıq üçün hansı konfiqurasiyanı tələb edir.",
      ru: "Какие задачи требуют какой конфигурации CPU, GPU и частоты экрана.",
    },
    category: { az: "Notbuklar", ru: "Ноутбуки" },
    date: "2026-01-30",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    content: {
      az: [
        "Ofis və təhsil üçün Intel Core i5 / Ryzen 5, 16 GB RAM və SSD əsas tələbdir. Yüngül dizayn və uzun batareya mühüm olur — bu seqmentdə Ultrabook modelləri seçilir.",
        "Oyun və 3D üçün discrete GPU (RTX / RX seriyası), 144 Hz+ ekran və effektiv soyutma lazımdır. Kontakt kataloqunda «geymer» filtri ilə uyğun modelləri sürətlə tapa bilərsiniz.",
        "MacBook ekosistemində işləyirsinizsə, M seriyası çiplər səssizlik və batareya müddəti verir; Windows proqramları üçün dual-boot və ya virtual maşın planlaşdırın.",
        "Hissə-hissə ödəniş 12–24 ay aralığında mövcuddur. Mağazada klaviatura, trackpad və portları yoxlayın — geri qaytarma siyasəti 7 gün ərzində rahat test imkanı verir.",
      ],
      ru: [
        "Для офиса и учёбы достаточно Intel Core i5 / Ryzen 5, 16 GB RAM и SSD. Важны лёгкий корпус и автономность — выбирают Ultrabook.",
        "Для игр и 3D нужны дискретная GPU (RTX / RX), экран 144 Hz+ и хорошее охлаждение. В каталоге Kontakt фильтр «геймер» ускорит поиск.",
        "Если вы в экосистеме MacBook, чипы M дают тишину и автономность; для Windows-программ планируйте dual-boot или виртуальную машину.",
        "Рассрочка на 12–24 месяца доступна. Проверьте клавиатуру, тачпад и порты в магазине — политика возврата даёт 7 дней на тест.",
      ],
    },
  },
  {
    slug: "robot-tozsoran-aile-ucun",
    title: {
      az: "Ailə üçün robot tozsoran: 5 vacib meyar",
      ru: "Робот-пылесос для семьи: 5 важных критериев",
    },
    excerpt: {
      az: "Lidar xəritələmə, süpürgə tutumu və ev heyvanı rejimi — hansı funksiyalar həqiqətən lazımdır?",
      ru: "Lidar, объём пылесборника и режим для питомцев — какие функции действительно нужны?",
    },
    category: { az: "Ev texnikası", ru: "Бытовая техника" },
    date: "2026-01-18",
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    content: {
      az: [
        "Robot tozsoran seçərkən ilk sual: mənzilin planı mürəkkəbdir? Lidar və xəritə yaddaşı olan modellər otaqları ayrı-ayrı təmizləyir və virtual sərhədlər qurmağa imkan verir.",
        "Xalça və sərt döşəmə arasında avtomatik güc tənzimi və güclü emiş ev heyvanı tükü üçün vacibdir. Öz-özünə boşaldan stansiya həftəlik qulluğu minimuma endirir.",
        "Səs səviyyəsi 60 dB-dən aşağı olduqda cihazı gecə işlətmək olar. Kontakt veb-saytında hər modelin texniki cədvəli və real istifadəçi rəylərinə baxın.",
        "Əlavə filtrlər və fırçalar ehtiyat hissələri kimi sifariş oluna bilər. Kampaniya dövründə tozsoran + mətbəx texnikası paket endirimləri tez-tez aktiv olur.",
      ],
      ru: [
        "Главный вопрос при выборе робота: сложная ли планировка? Lidar и память карт позволяют убирать комнаты по отдельности и ставить виртуальные границы.",
        "Автонастройка мощности между ковром и твёрдым полом и сильное всасывание важны для шерсти. Станция самоопустошения сокращает уход.",
        "При уровне шума ниже 60 dB можно запускать ночью. На сайте Kontakt есть спецификации и отзывы.",
        "Фильтры и щётки заказываются как расходники. В акциях часто скидки на набор «пылесос + кухня».",
      ],
    },
  },
  {
    slug: "smart-saat-saglamliq-izleme",
    title: {
      az: "Smart saatlar: sağlamlıq izləmə və gündəlik rahatlıq",
      ru: "Смарт-часы: здоровье и удобство каждый день",
    },
    excerpt: {
      az: "EKG, yuxu analizi və idman rejimləri — hansı saat hansı həyat tərzinə uyğundur?",
      ru: "ЭКГ, анализ сна и спортивные режимы — какие часы подходят вашему образу жизни?",
    },
    category: { az: "Smart qadjetlər", ru: "Смарт-гаджеты" },
    date: "2025-12-22",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    content: {
      az: [
        "Apple Watch, Samsung Galaxy Watch və Garmin fərqli ekosistemlər təklif edir. iPhone istifadəçiləri üçün Watch tam inteqrasiya, Android üçün Galaxy və ya Wear OS modelləri daha uyğundur.",
        "Sağlamlıq funksiyaları — nəbz, qan oksigeni, yuxu mərhələləri — gündəlik motivasiya verir, lakin tibbi diaqnoz əvəzinə yalnız məlumat mənbəyidir.",
        "Batareya müddəti idmançılar üçün kritikdir: qara-göy ekranlı modellər 7–14 gün, tam rəngli ekranlar adətən 1–2 gün davam edir.",
        "Kontakt Home-da korpus ölçüsü və qayışları mağazada sınamaq olur. Hədiyyə mövsümündə smart saat + qulaqlıq paketləri populyardır.",
      ],
      ru: [
        "Apple Watch, Samsung Galaxy Watch и Garmin — разные экосистемы. Для iPhone лучше Watch, для Android — Galaxy или Wear OS.",
        "Пульс, SpO₂ и фазы сна мотивируют, но это не замена медицинской диагностики.",
        "Автономность важна спортсменам: always-on модели держат 7–14 дней, полноцветные — 1–2 дня.",
        "В Kontakt Home можно примерить размер корпуса и ремешок. В сезон подарков популярны наборы «часы + наушники».",
      ],
    },
  },
  {
    slug: "metbex-kombi-mikser-nece-secilir",
    title: {
      az: "Mətbəx kombi: mikser, blender və bişirmə üçün bir cihaz",
      ru: "Кухонный комбайн: миксер, блендер и готовка в одном",
    },
    excerpt: {
      az: "Güc, qabaq həcmi və təmizlənmə asanlığı — mətbəx köməkçisi seçərkən nəyə diqqət etməli?",
      ru: "Мощность, объём чаши и лёгкость мойки — на что смотреть при выборе помощника на кухне?",
    },
    category: { az: "Mətbəx texnikası", ru: "Кухонная техника" },
    date: "2025-12-05",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
    content: {
      az: [
        "Kombi mikserlər xəmirdən tutmuş sousa qədər geniş tapşırıqları öhdəsinə götürür. 1000 W+ motor sıx xəmir və qoz-fındıq öyütmə üçün daha etibarlıdır.",
        "Qabaq həcmi ailə sayına uyğun seçilməlidir: 3–4 nəfərlik ev üçün 3–4 litr, böyük ailələr üçün 5 litr və daha çox tövsiyə olunur.",
        "Dishwasher-safe aksesuarlar gündəlik istifadəni asanlaşdırır. Kontakt kataloqunda Bosch, Philips, Tefal və digər brendlərin müqayisə cədvəlləri var.",
        "Yeni il və Novruz kampaniyalarında mətbəx texnikasına endirim tez-tez tətbiq olunur — promokodlar bölməsini yoxlamağı unutmayın.",
      ],
      ru: [
        "Комбайны справляются от теста до соусов. Мотор 1000 W+ надёжнее для плотного теста и орехов.",
        "Объём чаши зависит от семьи: 3–4 л для 3–4 человек, 5 л и больше для большой семьи.",
        "Аксессуары, совместимые с посудомойкой, упрощают уход. В каталоге Kontakt — Bosch, Philips, Tefal и другие.",
        "На новогодних и весенних акциях скидки на кухню часты — загляните в раздел промокодов.",
      ],
    },
  },
  {
    slug: "trade-in-kohne-cihazi-endirime-cevir",
    title: {
      az: "Trade-in: köhnə cihazınızı yeni texnikaya endirimə çevirin",
      ru: "Trade-in: превратите старый гаджет в скидку на новую технику",
    },
    excerpt: {
      az: "Smartfon, planşet və noutbuk qiymətləndirməsi — Kontakt Home-da addım-addım proses.",
      ru: "Оценка смартфона, планшета и ноутбука — пошаговый процесс в Kontakt Home.",
    },
    category: { az: "Məsləhət", ru: "Советы" },
    date: "2025-11-20",
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80",
    content: {
      az: [
        "Trade-in proqramı köhnə, lakin işlək cihazınızı yeni alışda endirim kuponuna çevirir. Qiymət ekran vəziyyəti, batareya sağlamlığı və modelə görə formalaşır.",
        "Mağazaya gəlməzdən əvvəl məlumatlarınızı ehtiyat nüsxəsi kimi saxlayın və cihazı zavod parametrlərinə qaytarın. Kontakt mütəxəssisləri 15–20 dəqiqə ərzində ilkin qiymətləndirmə aparır.",
        "Endirim dərhal yeni smartfon, televizor və ya ev texnikası alışına tətbiq oluna bilər. Hissə-hissə ödənişlə birləşdikdə aylıq yük daha da azalır.",
        "Ətraflı şərtlər trade-in info səhifəsində və *6060 xəttində mövcuddur. Kampaniya günlərində trade-in bonus faizi artırıla bilər.",
      ],
      ru: [
        "Trade-in обменивает рабочий старый гаджет на скидку при покупке нового. Цена зависит от модели, экрана и батареи.",
        "Перед визитом сделайте резервную копию и сбросьте настройки. Специалисты Kontakt проводят оценку за 15–20 минут.",
        "Скидку можно сразу применить к новому телефону, TV или технике. Вместе с рассрочкой месячный платёж ниже.",
        "Подробные условия — на странице trade-in и по *6060. В дни акций бонус trade-in может быть выше.",
      ],
    },
  },
];

export const blogSlugs = blogPosts.map((p) => p.slug);

export function getBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatBlogDate(iso: string, locale: Locale): string {
  const tag = locale === "az" ? "az-Latn-AZ" : "ru-RU";
  return new Intl.DateTimeFormat(tag, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
