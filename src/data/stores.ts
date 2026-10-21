export type Store = {
  id: string;
  name: { az: string; ru: string };
  address: { az: string; ru: string };
  hours: { az: string; ru: string };
  phone: string;
  city: { az: string; ru: string };
  lat: number;
  lng: number;
};

const hoursDefault = { az: "10:00 – 21:00", ru: "10:00 – 21:00" };
const hoursMall = { az: "10:00 – 22:00", ru: "10:00 – 22:00" };

export const stores: Store[] = [
  {
    id: "28-may-smart",
    name: {
      az: 'Kontakt SMART "28 May metrosu"',
      ru: 'Kontakt SMART "м. 28 Мая"',
    },
    address: {
      az: "Nəsimi r-nu, Fizuli küç. 47-55",
      ru: "Насиминский р-н, ул. Физули 47-55",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.3797,
    lng: 49.8486,
  },
  {
    id: "28-mall",
    name: { az: 'Kontakt "28 Mall"', ru: 'Kontakt "28 Mall"' },
    address: {
      az: "Nəsimi r-nu, Azadlıq pr. 45, 28 Mall (1-ci mərtəbə)",
      ru: "Насиминский р-н, пр. Азадлыг 45, 28 Mall (1 этаж)",
    },
    hours: hoursMall,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.3854,
    lng: 49.8543,
  },
  {
    id: "ganclik-mall",
    name: { az: 'Kontakt "Gənclik Mall"', ru: 'Kontakt "Gənclik Mall"' },
    address: {
      az: "Nərimanov r-nu, F. X. Xoyski pr., Gənclik Mall (-1-ci mərtəbə)",
      ru: "Наримановский р-н, пр. Ф. Х. Хойского, Gənclik Mall (-1 этаж)",
    },
    hours: hoursMall,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.4012,
    lng: 49.8518,
  },
  {
    id: "deniz-mall",
    name: { az: 'Kontakt "Dəniz Mall"', ru: 'Kontakt "Dəniz Mall"' },
    address: {
      az: "Səbail r-nu, Neftçilər pr. 26 A, Dəniz Mall (4-cü mərtəbə)",
      ru: "Сабаильский р-н, пр. Нефтяников 26 A, Dəniz Mall (4 этаж)",
    },
    hours: hoursMall,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.3598,
    lng: 49.8356,
  },
  {
    id: "sahil",
    name: { az: 'Kontakt "Sahil metrosu"', ru: 'Kontakt "м. Сахил"' },
    address: {
      az: "Səbail r-nu, Ü. Hacıbəyov küç. və Bülbül pr. kəsişməsi",
      ru: "Сабаильский р-н, пересечение ул. У. Гаджибекова и пр. Бюльбюль",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.3665,
    lng: 49.8342,
  },
  {
    id: "nerimanov",
    name: {
      az: 'Kontakt "Nərimanov metrosu"',
      ru: 'Kontakt "м. Нариманов"',
    },
    address: {
      az: "Nərimanov r-nu, F. Yusifov küç. 87-89 (Metropark AVM-lə üzbəüz)",
      ru: "Наримановский р-н, ул. Ф. Юсифова 87-89",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.4042,
    lng: 49.8678,
  },
  {
    id: "neftciler-smart",
    name: {
      az: 'Kontakt SMART "Neftçilər metrosu"',
      ru: 'Kontakt SMART "м. Нефтчиляр"',
    },
    address: {
      az: "Nizami r-nu, Q. Qarayev pr. 62",
      ru: "Низами р-н, пр. Г. Караева 62",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.3842,
    lng: 49.9245,
  },
  {
    id: "xalqlar",
    name: {
      az: 'Kontakt "Xalqlar Dostluğu metrosu"',
      ru: 'Kontakt "м. Халглар Достлугу"',
    },
    address: {
      az: "Nizami r-nu, Q. Qarayev küç. 125B",
      ru: "Низами р-н, ул. Г. Караева 125B",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.3915,
    lng: 49.9512,
  },
  {
    id: "azadliq",
    name: {
      az: 'Kontakt "Azadlıq metrosu"',
      ru: 'Kontakt "м. Азадлыг"',
    },
    address: {
      az: "Binəqədi r-nu, Süleyman Sani Axundov küç.",
      ru: "Бинегадинский р-н, ул. С. С. Ахундова",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.4238,
    lng: 49.8515,
  },
  {
    id: "inshaatchilar",
    name: {
      az: 'Kontakt "İnşaatçılar metrosu"',
      ru: 'Kontakt "м. Иншаатчылар"',
    },
    address: {
      az: "Yasamal r-nu, A. M. Şərifzadə küç. 174, blok 4",
      ru: "Ясамальский р-н, ул. А. М. Шарифзаде 174, блок 4",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.3958,
    lng: 49.8162,
  },
  {
    id: "vurgun",
    name: {
      az: 'Kontakt "Vurğun Residence"',
      ru: 'Kontakt "Vurğun Residence"',
    },
    address: {
      az: "Nəsimi r-nu, S. Vurğun küç. 110",
      ru: "Насиминский р-н, ул. С. Вургуна 110",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.3735,
    lng: 49.842,
  },
  {
    id: "ukrayna",
    name: {
      az: 'Kontakt "Ukrayna dairəsi"',
      ru: 'Kontakt "Украинский круг"',
    },
    address: {
      az: "Xətai r-nu, M. Hadi küç. 2472",
      ru: "Хатаинский р-н, ул. М. Хади 2472",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.3812,
    lng: 49.8895,
  },
  {
    id: "3mkr",
    name: {
      az: 'Kontakt "3-cü mkr dairəsi"',
      ru: 'Kontakt "3-й мкр"',
    },
    address: {
      az: "Nəsimi r-nu, A. Mustafayev küç. 8",
      ru: "Насиминский р-н, ул. А. Мустафаева 8",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.4182,
    lng: 49.8668,
  },
  {
    id: "bakixanov",
    name: { az: 'Kontakt "Bakıxanov"', ru: 'Kontakt "Бакиханов"' },
    address: {
      az: "Sabunçu r., Bakıxanov qəs. (Bakıxanov bazarının yanı)",
      ru: "Сабунчинский р-н, пос. Бакиханов",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Bakı", ru: "Баку" },
    lat: 40.419,
    lng: 49.9685,
  },
  {
    id: "xirdalan",
    name: { az: 'Kontakt "Xırdalan"', ru: 'Kontakt "Хырдалан"' },
    address: {
      az: "Xırdalan ş., Mehdi Hüseynzadə küç. 541",
      ru: "г. Хырдалан, ул. Мехти Гусейнзаде 541",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Xırdalan", ru: "Хырдалан" },
    lat: 40.4485,
    lng: 49.7555,
  },
  {
    id: "sumqayit-10",
    name: {
      az: 'Kontakt "Sumqayıt 10-cu mkr"',
      ru: 'Kontakt "Сумгаит 10 мкр"',
    },
    address: {
      az: "Sumqayıt şəh., 10-cu mkr., Babək küç. 10",
      ru: "г. Сумгаит, 10 мкр., ул. Бабека 10",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Sumqayıt", ru: "Сумгаит" },
    lat: 40.5875,
    lng: 49.681,
  },
  {
    id: "sumqayit-sulh",
    name: {
      az: 'Kontakt "Sumqayıt Sülh küçəsi"',
      ru: 'Kontakt "Сумгаит ул. Сульх"',
    },
    address: {
      az: "Sumqayıt şəh., 2-ci mkr., Sülh küç. 312",
      ru: "г. Сумгаит, 2 мкр., ул. Сульх 312",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Sumqayıt", ru: "Сумгаит" },
    lat: 40.595,
    lng: 49.668,
  },
  {
    id: "gence-mall",
    name: { az: 'Kontakt "Gəncə Mall"', ru: 'Kontakt "Gəncə Mall"' },
    address: {
      az: "Gəncə şəh., Heydər Əliyev pr. 433, Gəncə Mall, -1-ci mərtəbə",
      ru: "г. Гянджа, пр. Гейдара Алиева 433, Gəncə Mall, -1 этаж",
    },
    hours: hoursMall,
    phone: "*6060",
    city: { az: "Gəncə", ru: "Гянджа" },
    lat: 40.682,
    lng: 46.3595,
  },
  {
    id: "gence-bayraq",
    name: {
      az: 'Kontakt "Gəncə Bayraq Meydanı"',
      ru: 'Kontakt "Гянджа Площадь флага"',
    },
    address: {
      az: "Gəncə şəh., Nizami küç. 35",
      ru: "г. Гянджа, ул. Низами 35",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Gəncə", ru: "Гянджа" },
    lat: 40.6765,
    lng: 46.356,
  },
  {
    id: "nakhchivan",
    name: { az: 'Kontakt "Naxçıvan"', ru: 'Kontakt "Нахчыван"' },
    address: {
      az: "Naxçıvan şəh., Nəsrəddin Tusi küç. 11",
      ru: "г. Нахчыван, ул. Насреддина Туси 11",
    },
    hours: { az: "10:00 – 20:00", ru: "10:00 – 20:00" },
    phone: "*6060",
    city: { az: "Naxçıvan", ru: "Нахчыван" },
    lat: 39.2089,
    lng: 45.4122,
  },
  {
    id: "lankaran",
    name: { az: 'Kontakt "Lənkəran"', ru: 'Kontakt "Ленкорань"' },
    address: {
      az: "Lənkəran şəh, İ. Səmədzadə küç. 50",
      ru: "г. Ленкорань, ул. И. Самедзаде 50",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Lənkəran", ru: "Ленкорань" },
    lat: 38.7539,
    lng: 48.851,
  },
  {
    id: "mingachevir",
    name: { az: 'Kontakt "Mingəçevir"', ru: 'Kontakt "Мингечевир"' },
    address: {
      az: "Mingəçevir şəh., M. Maqomayev küç.",
      ru: "г. Мингечевир, ул. М. Магомаева",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Mingəçevir", ru: "Мингечевир" },
    lat: 40.77,
    lng: 47.0489,
  },
  {
    id: "shaki",
    name: { az: "Kontakt Şəki", ru: "Kontakt Шеки" },
    address: {
      az: "Şəki şəh., M.Ə. Rəsulzadə küç.",
      ru: "г. Шеки, ул. М. А. Расулзаде",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Şəki", ru: "Шеки" },
    lat: 41.1915,
    lng: 47.1705,
  },
  {
    id: "qabala",
    name: { az: 'Kontakt "Qəbələ"', ru: 'Kontakt "Габала"' },
    address: {
      az: "Qəbələ r., S. Vurğun küç. 1A",
      ru: "Габалинский р-н, ул. С. Вургуна 1A",
    },
    hours: hoursDefault,
    phone: "*6060",
    city: { az: "Qəbələ", ru: "Габала" },
    lat: 40.9814,
    lng: 47.8458,
  },
];
