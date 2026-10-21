export type MegaLink = {
  az: string;
  ru: string;
  href: string;
};

export type MegaGroup = {
  title: { az: string; ru: string };
  href?: string;
  links?: MegaLink[];
};

export type MegaCategory = {
  id: string;
  slug: string;
  name: { az: string; ru: string };
  icon: string;
  href: string;
  groups: MegaGroup[];
  promo?: string;
};

const icon = (file: string) =>
  `https://api.kontakt.az/media/kontaktapi/navigation/images/${file}`;

const promo = (file: string) =>
  `https://api.kontakt.az/media/kontaktapi/navigation/images/${file}`;

const L = (az: string, ru: string, href: string): MegaLink => ({ az, ru, href });
const G = (
  az: string,
  ru: string,
  links?: MegaLink[],
  href?: string
): MegaGroup => ({
  title: { az, ru },
  links,
  href,
});

export const megaMenu: MegaCategory[] = [
  {
    id: "winter",
    slug: "evini-qisa-hazirla",
    name: { az: "Evini qışa hazırla", ru: "Подготовь дом к зиме" },
    icon: icon("utmplnyedma_1_stroke_1_.svg"),
    href: "/kataloq/evini-qisa-hazirla",
    promo: promo("250x600_az_1_kombi_16.10.26.jpg"),
    groups: [
      G("Seksiyalı radiatorlar", "Секционные радиаторы", [
        L("HOFFMANN", "HOFFMANN", "/kataloq/ev-texnikasi"),
        L("Royal Thermo", "Royal Thermo", "/kataloq/ev-texnikasi"),
        L("Radyal", "Radyal", "/kataloq/ev-texnikasi"),
        L("Mirado", "Mirado", "/kataloq/ev-texnikasi"),
        L("Global", "Global", "/kataloq/ev-texnikasi"),
      ]),
      G("İsti döşəmə", "Тёплый пол", [
        L("Elektrotermik başlıq", "Электротермическая головка", "/kataloq/ev-texnikasi"),
        L("İstilik borusu", "Труба отопления", "/kataloq/ev-texnikasi"),
        L("Kollektor", "Коллектор", "/kataloq/ev-texnikasi"),
      ]),
      G("Panel radiatorlar", "Панельные радиаторы", [
        L("DemirDöküm", "DemirDöküm", "/kataloq/ev-texnikasi"),
        L("Nostalgia", "Nostalgia", "/kataloq/ev-texnikasi"),
        L("Warmhaus", "Warmhaus", "/kataloq/ev-texnikasi"),
      ]),
      G("Qızdırıcılar", "Обогреватели", [
        L("Konvektorlar", "Конвекторы", "/kataloq/ev-texnikasi"),
        L("İnfraqırmızı qızdırıcılar", "Инфракрасные обогреватели", "/kataloq/ev-texnikasi"),
        L("Qızdırıcı ventilyatorlar", "Тепловентиляторы", "/kataloq/ev-texnikasi"),
      ]),
      G("Kombi sistemləri", "Комби-системы", [
        L("Kondensasiyalı", "Конденсационные", "/kataloq/ev-texnikasi"),
        L("Konveksiyalı", "Конвекционные", "/kataloq/ev-texnikasi"),
        L("Kombinin işə salınması", "Запуск комби", "/kataloq/ev-texnikasi"),
      ]),
    ],
  },
  {
    id: "coffee",
    slug: "first-coffee",
    name: { az: "First Coffee", ru: "First Coffee" },
    icon: icon("First_coffee.svg"),
    href: "/kataloq/first-coffee",
    groups: [
      G("Qəhvəbişirənlər", "Кофемашины", [
        L("Avtomatik", "Автоматические", "/kataloq/metbex-texnikasi"),
        L("Kapsul", "Капсульные", "/kataloq/metbex-texnikasi"),
        L("Manual", "Ручные", "/kataloq/metbex-texnikasi"),
      ]),
      G("Qəhvə aksesuarları", "Кофейные аксессуары", [
        L("Dəyirmanlar", "Кофемолки", "/kataloq/metbex-texnikasi"),
        L("Südlük köpükləndiricilər", "Капучинаторы", "/kataloq/metbex-texnikasi"),
        L("Qəhvə fincanları", "Чашки", "/kataloq/qab-qacaq"),
      ]),
      G("Qəhvə və kapsula", "Кофе и капсулы", [
        L("Dənəvər qəhvə", "Зерновой кофе", "/kataloq/metbex-texnikasi"),
        L("Kapsulalar", "Капсулы", "/kataloq/metbex-texnikasi"),
      ]),
    ],
  },
  {
    id: "gamer",
    slug: "geymerler",
    name: { az: "Gamer zona", ru: "Gamer zona" },
    icon: icon("gamer_zone_react_new_33.svg"),
    href: "/kataloq/geymerler",
    groups: [
      G("Gaming TV", "Gaming TV", undefined, "/kataloq/tv-audio"),
      G("Oyun konsolları", "Игровые консоли", [
        L("Anbernic", "Anbernic", "/kataloq/notbuklar"),
        L("Miyoo", "Miyoo", "/kataloq/notbuklar"),
      ]),
      G("Oyun periferiyası", "Игровая периферия", [
        L("Oyun klaviaturaları", "Игровые клавиатуры", "/kataloq/notbuklar"),
        L("Oyun üçün Mouse", "Игровые мыши", "/kataloq/notbuklar"),
        L("Oyun üçün Mouse pad", "Коврики", "/kataloq/notbuklar"),
        L("Oyun kresloları", "Игровые кресла", "/kataloq/mebel"),
        L("Oyun qulaqlıqları", "Игровые гарнитуры", "/kataloq/smart-qadjetler"),
        L("Mikrofonlar", "Микрофоны", "/kataloq/tv-audio"),
      ]),
      G("Oyun smartfonları", "Игровые смартфоны", undefined, "/kataloq/smartfonlar"),
      G("Oyun monitorları", "Игровые мониторы", [
        L("Porodo", "Porodo", "/kataloq/notbuklar"),
        L("Xiaomi", "Xiaomi", "/kataloq/notbuklar"),
        L("Asus", "Asus", "/kataloq/notbuklar"),
        L("Dell", "Dell", "/kataloq/notbuklar"),
      ]),
      G("Oyun routerləri", "Игровые роутеры", undefined, "/kataloq/smart-qadjetler"),
      G("Videooyun avadanlıqları", "Игровое оборудование", [
        L("Konsol", "Консоли", "/kataloq/notbuklar"),
        L("Oyun manipulyatorları", "Геймпады", "/kataloq/notbuklar"),
        L("Oyun diskləri", "Игровые диски", "/kataloq/notbuklar"),
      ]),
      G("Oyun notbukları", "Игровые ноутбуки", [
        L("Asus", "Asus", "/kataloq/notbuklar"),
        L("Acer", "Acer", "/kataloq/notbuklar"),
        L("MSI", "MSI", "/kataloq/notbuklar"),
        L("HP", "HP", "/kataloq/notbuklar"),
        L("Lenovo", "Lenovo", "/kataloq/notbuklar"),
      ]),
      G("PlayStation", "PlayStation", [
        L("PlayStation 5 oyunları", "Игры PlayStation 5", "/kataloq/notbuklar"),
        L("PlayStation 4 oyunları", "Игры PlayStation 4", "/kataloq/notbuklar"),
        L("PlayStation qulaqlıqları", "Гарнитуры PlayStation", "/kataloq/smart-qadjetler"),
        L("PlayStation manipulyatorları", "Геймпады PlayStation", "/kataloq/notbuklar"),
      ]),
      G("Kompüter hissələri", "Комплектующие", [
        L("Ana plata", "Материнские платы", "/kataloq/notbuklar"),
        L("Operativ yaddaş", "Оперативная память", "/kataloq/notbuklar"),
        L("Sistem blokları", "Системные блоки", "/kataloq/notbuklar"),
      ]),
    ],
  },
  {
    id: "apple",
    slug: "apple",
    name: { az: "Apple Space", ru: "Apple Space" },
    icon: icon("Apple.svg"),
    href: "/kataloq/apple",
    groups: [
      G("iPhone", "iPhone", [
        L("iPhone 17 Pro Max", "iPhone 17 Pro Max", "/kataloq/smartfonlar"),
        L("iPhone 17 Pro", "iPhone 17 Pro", "/kataloq/smartfonlar"),
        L("iPhone 16", "iPhone 16", "/kataloq/smartfonlar"),
        L("iPhone 15", "iPhone 15", "/kataloq/smartfonlar"),
      ]),
      G("Mac", "Mac", [
        L("MacBook Air", "MacBook Air", "/kataloq/notbuklar"),
        L("MacBook Pro", "MacBook Pro", "/kataloq/notbuklar"),
        L("iMac", "iMac", "/kataloq/notbuklar"),
        L("Mac mini", "Mac mini", "/kataloq/notbuklar"),
      ]),
      G("iPad", "iPad", [
        L("iPad Pro", "iPad Pro", "/kataloq/smart-qadjetler"),
        L("iPad Air", "iPad Air", "/kataloq/smart-qadjetler"),
        L("iPad", "iPad", "/kataloq/smart-qadjetler"),
      ]),
      G("Watch & Audio", "Watch & Audio", [
        L("Apple Watch", "Apple Watch", "/kataloq/smart-qadjetler"),
        L("AirPods", "AirPods", "/kataloq/smart-qadjetler"),
        L("HomePod", "HomePod", "/kataloq/tv-audio"),
      ]),
      G("Aksesuarlar", "Аксессуары", [
        L("Qapaqlar", "Чехлы", "/kataloq/smartfonlar"),
        L("Adapterlər", "Адаптеры", "/kataloq/smartfonlar"),
        L("Kabelər", "Кабели", "/kataloq/smartfonlar"),
      ]),
    ],
  },
  {
    id: "together",
    slug: "birlikde-al",
    name: { az: "Birlikdə al", ru: "Покупай вместе" },
    icon: icon("1_1.svg"),
    href: "/kataloq/birlikde-al",
    groups: [
      G("1+1 dəstlər", "Наборы 1+1", [
        L("Mətbəx dəstləri", "Кухонные наборы", "/kataloq/metbex-texnikasi"),
        L("Ev texnikası dəstləri", "Наборы для дома", "/kataloq/ev-texnikasi"),
        L("Gözəllik dəstləri", "Наборы для красоты", "/kataloq/gozellik"),
      ]),
    ],
  },
  {
    id: "phones",
    slug: "smartfonlar",
    name: { az: "Smartfonlar və aksesuarlar", ru: "Смартфоны и аксессуары" },
    icon: icon("smartfoni.svg"),
    href: "/kataloq/smartfonlar",
    groups: [
      G("Smartfonlar", "Смартфоны", [
        L("Apple", "Apple", "/kataloq/smartfonlar"),
        L("Samsung", "Samsung", "/kataloq/smartfonlar"),
        L("Xiaomi", "Xiaomi", "/kataloq/smartfonlar"),
        L("Huawei", "Huawei", "/kataloq/smartfonlar"),
        L("Honor", "Honor", "/kataloq/smartfonlar"),
        L("Realme", "Realme", "/kataloq/smartfonlar"),
      ]),
      G("Aksesuarlar", "Аксессуары", [
        L("Qapaqlar", "Чехлы", "/kataloq/smartfonlar"),
        L("Ekran qoruyucuları", "Защитные стёкла", "/kataloq/smartfonlar"),
        L("Enerji toplama cihazları", "Пауэрбанки", "/kataloq/smartfonlar"),
        L("Adapter və kabel", "Зарядки и кабели", "/kataloq/smartfonlar"),
      ]),
      G("Planşetlər", "Планшеты", [
        L("Apple iPad", "Apple iPad", "/kataloq/smart-qadjetler"),
        L("Samsung Galaxy Tab", "Samsung Galaxy Tab", "/kataloq/smart-qadjetler"),
        L("Xiaomi Pad", "Xiaomi Pad", "/kataloq/smart-qadjetler"),
      ]),
    ],
  },
  {
    id: "gadgets",
    slug: "smart-qadjetler",
    name: { az: "Smart qadjetlər", ru: "Смарт-гаджеты" },
    icon: icon("smart_gadjeti.svg"),
    href: "/kataloq/smart-qadjetler",
    groups: [
      G("Smart saatlar", "Смарт-часы", [
        L("Apple Watch", "Apple Watch", "/kataloq/smart-qadjetler"),
        L("Samsung Galaxy Watch", "Samsung Galaxy Watch", "/kataloq/smart-qadjetler"),
        L("Xiaomi / Redmi Watch", "Xiaomi / Redmi Watch", "/kataloq/smart-qadjetler"),
        L("Huawei Watch", "Huawei Watch", "/kataloq/smart-qadjetler"),
      ]),
      G("Qulaqlıqlar", "Наушники", [
        L("TWS", "TWS", "/kataloq/smart-qadjetler"),
        L("Over-ear", "Накладные", "/kataloq/smart-qadjetler"),
        L("Uşaq qulaqlıqları", "Детские", "/kataloq/smart-qadjetler"),
      ]),
      G("Digər qadjetlər", "Другие гаджеты", [
        L("Fitness qolbaqlar", "Фитнес-браслеты", "/kataloq/smart-qadjetler"),
        L("VR eynəklər", "VR-очки", "/kataloq/smart-qadjetler"),
        L("Smart ev", "Умный дом", "/kataloq/smart-qadjetler"),
      ]),
    ],
  },
  {
    id: "notebooks",
    slug: "notbuklar",
    name: { az: "Notbuklar, PK, planşetlər", ru: "Ноутбуки, ПК, планшеты" },
    icon: icon("noutbuki.svg"),
    href: "/kataloq/notbuklar",
    groups: [
      G("Notbuklar", "Ноутбуки", [
        L("Apple MacBook", "Apple MacBook", "/kataloq/notbuklar"),
        L("Asus", "Asus", "/kataloq/notbuklar"),
        L("Lenovo", "Lenovo", "/kataloq/notbuklar"),
        L("HP", "HP", "/kataloq/notbuklar"),
        L("Acer", "Acer", "/kataloq/notbuklar"),
        L("Dell", "Dell", "/kataloq/notbuklar"),
      ]),
      G("Monitorlar", "Мониторы", [
        L("Gaming", "Игровые", "/kataloq/notbuklar"),
        L("Ofis", "Офисные", "/kataloq/notbuklar"),
        L("Ultrawide", "Ultrawide", "/kataloq/notbuklar"),
      ]),
      G("Kompüterlər", "Компьютеры", [
        L("Sistem blokları", "Системные блоки", "/kataloq/notbuklar"),
        L("Monobloklar", "Моноблоки", "/kataloq/notbuklar"),
        L("Mini PC", "Mini PC", "/kataloq/notbuklar"),
      ]),
      G("Periferiya", "Периферия", [
        L("Klaviatura", "Клавиатуры", "/kataloq/notbuklar"),
        L("Mouse", "Мыши", "/kataloq/notbuklar"),
        L("Printer / MFP", "Принтеры", "/kataloq/notbuklar"),
      ]),
    ],
  },
  {
    id: "tv",
    slug: "tv-audio",
    name: { az: "TV, audio və foto", ru: "ТВ, аудио и фото" },
    icon: icon("TV.svg"),
    href: "/kataloq/tv-audio",
    groups: [
      G("Televizorlar", "Телевизоры", [
        L("Samsung", "Samsung", "/kataloq/tv-audio"),
        L("LG", "LG", "/kataloq/tv-audio"),
        L("Toshiba", "Toshiba", "/kataloq/tv-audio"),
        L("Xiaomi", "Xiaomi", "/kataloq/tv-audio"),
        L("Sony", "Sony", "/kataloq/tv-audio"),
      ]),
      G("Audio", "Аудио", [
        L("Soundbar", "Саундбары", "/kataloq/tv-audio"),
        L("Portativ kolonkalar", "Портативные колонки", "/kataloq/tv-audio"),
        L("Musiqi mərkəzləri", "Музыкальные центры", "/kataloq/tv-audio"),
      ]),
      G("Foto və video", "Фото и видео", [
        L("Kameralar", "Камеры", "/kataloq/tv-audio"),
        L("Ekşn kameralar", "Экшн-камеры", "/kataloq/tv-audio"),
        L("Dronlar", "Дроны", "/kataloq/tv-audio"),
      ]),
    ],
  },
  {
    id: "home",
    slug: "ev-texnikasi",
    name: { az: "Ev texnikası", ru: "Техника для дома" },
    icon: icon("texnikadladoma.svg"),
    href: "/kataloq/ev-texnikasi",
    groups: [
      G("Paltaryuyan maşınlar", "Стиральные машины", [
        L("LG", "LG", "/axtaris?q=paltaryuyan%20LG"),
        L("Samsung", "Samsung", "/axtaris?q=paltaryuyan%20Samsung"),
        L("Bosch", "Bosch", "/axtaris?q=paltaryuyan%20Bosch"),
        L("HOFFMANN", "HOFFMANN", "/axtaris?q=paltaryuyan%20HOFFMANN"),
      ]),
      G("Tozsoranlar", "Пылесосы", [
        L("Robot tozsoranlar", "Роботы-пылесосы", "/kataloq/robot-tozsoranlar"),
        L("Şaquli tozsoranlar", "Вертикальные", "/kataloq/saquli-tozsoranlar"),
        L("Klassik tozsoranlar", "Классические", "/kataloq/klassik-tozsoranlar"),
      ]),
      G("İqlim texnikası", "Климатическая техника", [
        L("Kondisionerlər", "Кондиционеры", "/kataloq/kondisionerler"),
        L("Kombi sistemləri", "Комби-системы", "/kataloq/ev-texnikasi"),
        L("Ventilyatorlar", "Вентиляторы", "/kataloq/ev-texnikasi"),
      ]),
      G("Digər", "Другое", [
        L("Ütülər", "Утюги", "/kataloq/ev-texnikasi"),
        L("Quruducular", "Сушильные машины", "/kataloq/ev-texnikasi"),
      ]),
    ],
  },
  {
    id: "kitchen",
    slug: "metbex-texnikasi",
    name: { az: "Mətbəx texnikası", ru: "Техника для кухни" },
    icon: icon("texnika_dla_kuxni.svg"),
    href: "/kataloq/metbex-texnikasi",
    groups: [
      G("Böyük mətbəx", "Крупная техника", [
        L("Soyuducular", "Холодильники", "/kataloq/metbex-texnikasi"),
        L("Qabyuyanlar", "Посудомоечные", "/kataloq/qabyuyanlar"),
        L("Sobalar", "Духовые шкафы", "/kataloq/metbex-texnikasi"),
        L("Plitələr", "Варочные панели", "/kataloq/metbex-texnikasi"),
      ]),
      G("Xırda mətbəx", "Мелкая техника", [
        L("Blender / Mikser", "Блендеры / Миксеры", "/kataloq/metbex-texnikasi"),
        L("Qəhvəbişirənlər", "Кофемашины", "/kataloq/qehvebisirenler"),
        L("Air fryer", "Аэрогрили", "/kataloq/metbex-texnikasi"),
        L("Çaydanlar", "Чайники", "/kataloq/metbex-texnikasi"),
      ]),
      G("Quraşdırılan texnika", "Встраиваемая техника", [
        L("Quraşdırılan plitələr", "Варочные панели", "/kataloq/metbex-texnikasi"),
        L("Quraşdırılan sobalar", "Духовые шкафы", "/kataloq/metbex-texnikasi"),
        L("Aspiratorlar", "Вытяжки", "/kataloq/metbex-texnikasi"),
      ]),
    ],
  },
  {
    id: "dishes",
    slug: "qab-qacaq",
    name: { az: "Qab-qacaq", ru: "Посуда" },
    icon: icon("posuda.svg"),
    href: "/kataloq/qab-qacaq",
    groups: [
      G("Bişirmə qabları", "Посуда для готовки", [
        L("Qazan dəstləri", "Наборы кастрюль", "/kataloq/qab-qacaq"),
        L("Tavalar", "Сковороды", "/kataloq/qab-qacaq"),
        L("Təzyiqli qazanlar", "Скороварки", "/kataloq/qab-qacaq"),
      ]),
      G("Süfrə", "Сервировка", [
        L("Boşqablar", "Тарелки", "/kataloq/qab-qacaq"),
        L("Stəkan / Fincan", "Бокалы / Чашки", "/kataloq/qab-qacaq"),
        L("Çəngəl-qaşıq", "Столовые приборы", "/kataloq/qab-qacaq"),
      ]),
    ],
  },
  {
    id: "beauty",
    slug: "gozellik",
    name: { az: "Gözəllik, sağlamlıq və baxım", ru: "Красота, здоровье и уход" },
    icon: icon("krasota_i_zdorovye.svg"),
    href: "/kataloq/gozellik",
    groups: [
      G("Saç üçün", "Для волос", [
        L("Fenlər", "Фены", "/kataloq/gozellik"),
        L("Saç düzəldicilər", "Выпрямители", "/kataloq/gozellik"),
        L("Saç maşınları", "Плойки", "/kataloq/gozellik"),
      ]),
      G("Baxım", "Уход", [
        L("Epilyatorlar", "Эпиляторы", "/kataloq/gozellik"),
        L("Təraş aparatları", "Бритвы", "/kataloq/gozellik"),
        L("Diş fırçaları", "Зубные щётки", "/kataloq/gozellik"),
      ]),
      G("Sağlamlıq", "Здоровье", [
        L("Tərəzilər", "Весы", "/kataloq/gozellik"),
        L("Massaj cihazları", "Массажёры", "/kataloq/gozellik"),
      ]),
    ],
  },
  {
    id: "furniture",
    slug: "mebel",
    name: { az: "Mebel və tekstil", ru: "Мебель и текстиль" },
    icon: icon("mebel.svg"),
    href: "/kataloq/mebel",
    groups: [
      G("Mebel", "Мебель", [
        L("Divanlar", "Диваны", "/kataloq/mebel"),
        L("Çarpayılar", "Кровати", "/kataloq/mebel"),
        L("Şkaflar", "Шкафы", "/kataloq/mebel"),
        L("Masalar / Stullar", "Столы / Стулья", "/kataloq/mebel"),
      ]),
      G("Tekstil", "Текстиль", [
        L("Yataq dəstləri", "Постельное бельё", "/kataloq/mebel"),
        L("Sufre / Pərdə", "Скатерти / Шторы", "/kataloq/mebel"),
        L("Xalçalar", "Ковры", "/kataloq/mebel"),
      ]),
    ],
  },
  {
    id: "transport",
    slug: "neqliyyat",
    name: { az: "Nəqliyyat", ru: "Транспорт" },
    icon: icon("Car.svg"),
    href: "/kataloq/neqliyyat",
    groups: [
      G("Nəqliyyat", "Транспорт", [
        L("Velosipedlər", "Велосипеды", "/kataloq/neqliyyat"),
        L("Skuterlər", "Самокаты", "/kataloq/neqliyyat"),
        L("Elektroskuterlər", "Электросамокаты", "/kataloq/neqliyyat"),
      ]),
      G("Aksesuarlar", "Аксессуары", [
        L("Dəbilqələr", "Шлемы", "/kataloq/neqliyyat"),
        L("Kilidlər", "Замки", "/kataloq/neqliyyat"),
      ]),
    ],
  },
  {
    id: "sport",
    slug: "idman",
    name: { az: "İdman və əyləncə", ru: "Спорт и развлечения" },
    icon: icon("sport.svg"),
    href: "/kataloq/idman",
    groups: [
      G("İdman", "Спорт", [
        L("Fitnes", "Фитнес", "/kataloq/idman"),
        L("Top / Oyunlar", "Мячи / Игры", "/kataloq/idman"),
        L("Turizm", "Туризм", "/kataloq/idman"),
      ]),
      G("Əyləncə", "Развлечения", [
        L("Oyunlar", "Игры", "/kataloq/idman"),
        L("Musiqi alətləri", "Музыкальные инструменты", "/kataloq/idman"),
      ]),
    ],
  },
  {
    id: "kids",
    slug: "usaq-alemi",
    name: { az: "Uşaq aləmi", ru: "Детский мир" },
    icon: icon("detskiy_mir.svg"),
    href: "/kataloq/usaq-alemi",
    groups: [
      G("Uşaqlar üçün", "Для детей", [
        L("Oyuncaqlar", "Игрушки", "/kataloq/usaq-alemi"),
        L("Uşaq arabaları", "Коляски", "/kataloq/usaq-alemi"),
        L("Uşaq mebeli", "Детская мебель", "/kataloq/usaq-alemi"),
      ]),
    ],
  },
  {
    id: "pets",
    slug: "ev-heyvanlari",
    name: { az: "Ev heyvanları üçün məhsullar", ru: "Товары для животных" },
    icon: icon("zootovari.svg"),
    href: "/kataloq/ev-heyvanlari",
    groups: [
      G("Heyvanlar üçün", "Для животных", [
        L("Yem", "Корм", "/kataloq/ev-heyvanlari"),
        L("Aksesuarlar", "Аксессуары", "/kataloq/ev-heyvanlari"),
        L("Daşıma çantaları", "Переноски", "/kataloq/ev-heyvanlari"),
      ]),
    ],
  },
  {
    id: "repair",
    slug: "temir-tikinti",
    name: { az: "Təmir və tikinti", ru: "Ремонт и строительство" },
    icon: icon("remont.svg"),
    href: "/kataloq/temir-tikinti",
    groups: [
      G("Alətlər", "Инструменты", [
        L("Elektrik alətlər", "Электроинструмент", "/kataloq/temir-tikinti"),
        L("Əl alətləri", "Ручной инструмент", "/kataloq/temir-tikinti"),
      ]),
      G("Tikinti", "Строительство", [
        L("Boyalar", "Краски", "/kataloq/temir-tikinti"),
        L("İşıqlandırma", "Освещение", "/kataloq/temir-tikinti"),
      ]),
    ],
  },
  {
    id: "garden",
    slug: "ev-ve-bag",
    name: { az: "Ev və bağ", ru: "Дом и сад" },
    icon: icon("dom_i_dacha.svg"),
    href: "/kataloq/ev-ve-bag",
    groups: [
      G("Bağ", "Сад", [
        L("Bağ alətləri", "Садовый инструмент", "/kataloq/ev-ve-bag"),
        L("Suvarma", "Полив", "/kataloq/ev-ve-bag"),
        L("Manqal / BBQ", "Мангалы", "/kataloq/ev-ve-bag"),
      ]),
    ],
  },
  {
    id: "fashion",
    slug: "geyim",
    name: { az: "Geyim aksesuarları", ru: "Одежда и аксессуары" },
    icon: icon("aksessuari.svg"),
    href: "/kataloq/geyim",
    groups: [
      G("Aksesuarlar", "Аксессуары", [
        L("Çantalar", "Сумки", "/kataloq/geyim"),
        L("Saatlar", "Часы", "/kataloq/geyim"),
        L("Eynəklər", "Очки", "/kataloq/geyim"),
      ]),
    ],
  },
  {
    id: "services",
    slug: "xidmetler",
    name: { az: "Xidmətlər, abunəlik və soft", ru: "Услуги и подписки" },
    icon: icon("uslugi_1.svg"),
    href: "/kataloq/xidmetler",
    groups: [
      G("Xidmətlər", "Услуги", [
        L("Quraşdırma", "Установка", "/kataloq/xidmetler"),
        L("Zəmanət", "Гарантия", "/kataloq/xidmetler"),
        L("Abunəliklər", "Подписки", "/kataloq/xidmetler"),
      ]),
    ],
  },
  {
    id: "certificates",
    slug: "hediyye-sertifikatlari",
    name: { az: "Hədiyyə sertifikatları", ru: "Подарочные сертификаты" },
    icon: icon("sertifikati.svg"),
    href: "/kataloq/hediyye-sertifikatlari",
    groups: [
      G("Sertifikatlar", "Сертификаты", [
        L("Elektron kartlar", "Электронные карты", "/kataloq/hediyye-sertifikatlari"),
        L("Hədiyyə kartları", "Подарочные карты", "/kataloq/hediyye-sertifikatlari"),
      ]),
    ],
  },
];
