import { hiResImage } from "@/lib/images";
import catalogJson from "./catalog.json";
import variantJson from "./phone-variants.json";

export type Product = {
  id: string;
  slug: string;
  name: { az: string; ru: string };
  brand: string;
  category: string;
  image: string;
  images: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  badge?: { az: string; ru: string };
  weekly?: boolean;
  description: { az: string; ru: string };
  specs: { label: { az: string; ru: string }; value: { az: string; ru: string } }[];
  sku?: string;
  categoryPath?: string;
};

type CatalogItem = Product & { sku?: string; categoryPath?: string };

function withSharpImages<T extends { image?: string; images?: string[] }>(p: T): T {
  const image = p.image ? hiResImage(p.image) : p.image;
  const images = (p.images?.length ? p.images : image ? [image] : []).map(hiResImage);
  return { ...p, image, images };
}

const fromCatalog = (catalogJson as CatalogItem[]).map((p) =>
  withSharpImages({
    ...p,
    name: p.name ?? { az: "", ru: "" },
    description: p.description ?? p.name ?? { az: "", ru: "" },
    images: p.images?.length ? p.images : p.image ? [p.image] : [],
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 0,
    specs: p.specs || [],
  })
);

function bundle(
  id: string,
  slug: string,
  name: string,
  brand: string,
  image: string,
  price: number,
  oldPrice: number,
  onlineOnly = false
): Product {
  return {
    id,
    slug,
    name: { az: name, ru: name },
    brand,
    category: "idman",
    image: hiResImage(image),
    images: [hiResImage(image)],
    price,
    oldPrice,
    discount: Math.round(((oldPrice - price) / oldPrice) * 100),
    rating: 5,
    reviewCount: 0,
    badge: onlineOnly
      ? { az: "yalnız onlayn", ru: "только онлайн" }
      : undefined,
    description: {
      az: `${name}. Kontakt-da birlikdə daha sərfəli dəst, pulsuz çatdırılma.`,
      ru: `${name}. Набор выгоднее вместе, бесплатная доставка.`,
    },
    specs: [],
  };
}

const bundleProducts: Product[] = [
  bundle(
    "b-mix",
    "bundle-mix-aksesuar",
    "Bundle Mix aksesuar",
    "Kontakt",
    "https://api.kontakt.az/media/catalog/product/cache/6282c30fc03b0f87228ba5e924bc2e0e/t/m/tm-dg-acs-1109-pb-0639_123-b0f5a231.webp",
    229.99,
    469.99
  ),
  bundle(
    "b-razer",
    "gaming-set-razer",
    "Gaming set",
    "Razer",
    "https://api.kontakt.az/media/catalog/product/cache/6282c30fc03b0f87228ba5e924bc2e0e/t/m/tm-dg-acs-1109-mo-1006_213-d63063d7.webp",
    99.99,
    284.99
  ),
  bundle(
    "b-razer-p",
    "gaming-set-razer-premium",
    "Gaming set Razer Premium",
    "Razer",
    "https://api.kontakt.az/media/catalog/product/cache/6282c30fc03b0f87228ba5e924bc2e0e/t/m/tm-dg-acs-1109-mo-1005_1212-cb2fc253.webp",
    635,
    949.95
  ),
  bundle(
    "b-aw-mouse",
    "monitor-dell-alienware-25-aw2525hm-gaming-mouse-dell-alienware-aw620m-dark-side-of-the-moon",
    "Monitor Dell Alienware 25 AW2525HM + Gaming mouse Dell Alienware AW620M Dark Side of The Moon",
    "Dell",
    "https://api.kontakt.az/media/catalog/product/cache/6282c30fc03b0f87228ba5e924bc2e0e/t/m/tm-dg-kot-1114-mr-0626_11-90df46da.webp",
    649.99,
    799.99,
    true
  ),
  bundle(
    "b-aw-kb",
    "monitor-dell-alienware-25-aw2525hm-oyun-klaviaturasi-dell-alienware-aw920k-dark-side-of-the-moon",
    "Monitor Dell Alienware 25 AW2525HM + Oyun klaviaturası Dell Alienware AW920K Dark Side of The Moon",
    "Dell",
    "https://api.kontakt.az/media/catalog/product/cache/6282c30fc03b0f87228ba5e924bc2e0e/t/m/tm-dg-kot-1114-mr-0630-3b410f19.webp",
    899.99,
    1199.99,
    true
  ),
  bundle(
    "b-aw-hs",
    "monitor-dell-alienware-25-aw2525hm-qulaqliq-dell-alienware-aw520h-dark-side-of-the-moon",
    "Monitor Dell Alienware 25 AW2525HM + Qulaqlıq Dell Alienware AW520H Dark Side of The Moon",
    "Dell",
    "https://api.kontakt.az/media/catalog/product/cache/6282c30fc03b0f87228ba5e924bc2e0e/t/m/tm-dg-kot-1114-mr-0629-c82cc30a.webp",
    649.99,
    799.99,
    true
  ),
  bundle(
    "b-aw-k2",
    "monitor-dell-alienware-25-aw2525hm-oyun-klaviaturasi-dell-alienware-aw420k-qwerty",
    "Monitor Dell Alienware 25 AW2525HM + Oyun klaviaturası Dell Alienware AW420K Qwerty",
    "Dell",
    "https://api.kontakt.az/media/catalog/product/cache/6282c30fc03b0f87228ba5e924bc2e0e/t/m/tm-dg-kot-1114-mr-0628-454bce43.webp",
    749.99,
    999.99,
    true
  ),
];

const catalogSlugs = new Set(fromCatalog.map((p) => p.slug));

const phoneVariants = (variantJson as CatalogItem[])
  .filter((p) => p?.slug && !catalogSlugs.has(p.slug))
  .map((p) =>
    withSharpImages({
      ...p,
      name: p.name ?? { az: "", ru: "" },
      description: p.description ?? p.name ?? { az: "", ru: "" },
      images: p.images?.length ? p.images : p.image ? [p.image] : [],
      rating: p.rating || 4.5,
      reviewCount: p.reviewCount || 0,
      specs: p.specs || [],
    })
  );

export const products: Product[] = [
  ...fromCatalog,
  ...phoneVariants,
  ...bundleProducts.filter((p) => !catalogSlugs.has(p.slug)),
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function expandHomeList(
  slugs: string[],
  test: (p: Product) => boolean,
  count = 16
) {
  const picked = getProductsBySlugs(slugs);
  const ids = new Set(picked.map((p) => p.id));
  for (const p of products) {
    if (picked.length >= count) break;
    if (!ids.has(p.id) && test(p)) {
      picked.push(p);
      ids.add(p.id);
    }
  }
  return picked.slice(0, count);
}

export function getProductsBySlugs(slugs: string[]) {
  const found = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];
  if (found.length >= Math.min(4, slugs.length)) return found;
  // Fallback while catalog slugs differ from old homepage list
  const discounted = products
    .filter((p) => (p.discount ?? 0) > 0)
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
  const pool = discounted.length ? discounted : products;
  return pool.slice(0, Math.max(slugs.length, 6));
}

/** Name/slug heuristics — Magento leaf categories in the scrape are imperfect */
const featuredMatchers: Record<string, (p: Product) => boolean> = {
  smartfonlar: (p) =>
    p.category === "smartfonlar" || /iphone|galaxy|redmi|xiaomi|pixel/i.test(p.slug),
  notbuklar: (p) =>
    /^(Monitor|Sistem Bloku|Monoblok) /i.test(p.name.az) ||
    /^Notbuk(?! üçün)/i.test(p.name.az) ||
    /(macbook|ideapad|thinkpad|vivobook|zenbook|pavilion|inspiron)/i.test(
      p.name.az
    ),
  "tv-audio": (p) =>
    /televizor|soundbar|kolonka|saundbar/i.test(p.name.az) ||
    p.category === "tv-audio",
  "smart-qadjetler": (p) =>
    /qulaql|airpods|freebuds|saat|watch|smart.?saat/i.test(p.name.az) ||
    p.category === "smart-qadjetler",
  "ev-texnikasi": (p) =>
    /paltaryuyan|tozsoran|kondisioner|kombi|quruducu/i.test(p.name.az) ||
    p.category === "ev-texnikasi",
  "metbex-texnikasi": (p) =>
    /soyuducu|qabyuyan|mikrodalğa|soba|blender|qəhvə|qehve|air.?fryer/i.test(
      p.name.az
    ) || p.category === "metbex-texnikasi",
  gozellik: (p) =>
    /fen|ütü|utu|epilyator|tra[sş]q|massaj/i.test(p.name.az) ||
    p.category === "gozellik",
  mebel: (p) => p.category === "mebel",
  "qab-qacaq": (p) =>
    p.category === "qab-qacaq" || /qazan|tava|sufre|boşqab/i.test(p.name.az),
  kondisionerler: (p) => /kondisioner/i.test(p.name.az),
  tozsoranlar: (p) => /tozsoran/i.test(p.name.az),
  "robot-tozsoranlar": (p) => /robot.?tozsoran/i.test(p.name.az),
  "saquli-tozsoranlar": (p) =>
    /tozsoran/i.test(p.name.az) &&
    /şaquli|saquli|naqilsiz|vertikal/i.test(p.name.az),
  "klassik-tozsoranlar": (p) =>
    /tozsoran/i.test(p.name.az) &&
    !/robot|şaquli|saquli|naqilsiz|vertikal|benzinli|havavuran|hava üfür/i.test(
      p.name.az
    ),
  paltaryuyanlar: (p) => /paltaryuyan/i.test(p.name.az),
  qabyuyanlar: (p) => /qabyuyan/i.test(p.name.az),
  qehvebisirenler: (p) => /qəhvə|qehve|coffee|espresso/i.test(p.name.az),
  plansetler: (p) => /planşet|planset|ipad|tablet/i.test(p.name.az),
  tekstil: (p) => /tekstil|yorğan|yorgan|örtük|pərdə|perde/i.test(p.name.az),
};

export const extraCategoryTitles: Record<string, { az: string; ru: string }> = {
  kondisionerler: { az: "Kondisionerlər", ru: "Кондиционеры" },
  tozsoranlar: { az: "Tozsoranlar", ru: "Пылесосы" },
  "robot-tozsoranlar": { az: "Robot tozsoranlar", ru: "Роботы-пылесосы" },
  "saquli-tozsoranlar": { az: "Şaquli tozsoranlar", ru: "Вертикальные пылесосы" },
  "klassik-tozsoranlar": { az: "Klassik tozsoranlar", ru: "Классические пылесосы" },
  paltaryuyanlar: { az: "Paltaryuyanlar", ru: "Стиральные машины" },
  qabyuyanlar: { az: "Qabyuyanlar", ru: "Посудомоечные машины" },
  qehvebisirenler: { az: "Qəhvəbişirənlər", ru: "Кофемашины" },
  plansetler: { az: "Planşetlər", ru: "Планшеты" },
  tekstil: { az: "Tekstil", ru: "Текстиль" },
};

export function getFeaturedProducts(count = 8, category?: string) {
  const match = category ? featuredMatchers[category] : undefined;
  const pool = match
    ? products.filter(match)
    : category
      ? products.filter((p) => p.category === category)
      : products;
  const discounted = pool.filter((p) => (p.discount ?? 0) > 0);
  const source = discounted.length ? discounted : pool;
  return source.slice(0, count);
}

export function getProductsByCategory(category: string) {
  if (category === "kampaniyalar" || category === "apple") {
    if (category === "apple") return products.filter((p) => p.brand === "Apple");
    return products.filter((p) => (p.discount ?? 0) >= 15);
  }
  if (category === "birlikde-al" || category === "first-coffee") {
    return products.filter((p) => p.category === "metbex-texnikasi");
  }
  if (category === "evini-qisa-hazirla") {
    return products.filter((p) =>
      ["ev-texnikasi", "metbex-texnikasi"].includes(p.category)
    );
  }
  if (category === "geymerler") {
    return products.filter((p) => p.category === "notbuklar");
  }
  if (category === "all") {
    return products;
  }
  const matcher = featuredMatchers[category];
  if (matcher) return products.filter(matcher);
  return products.filter((p) => p.category === category);
}

export function searchProducts(query: string, limit = 500) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const out: Product[] = [];
  for (const p of products) {
    if (
      p.name.az.toLowerCase().includes(q) ||
      p.name.ru.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q))
    ) {
      out.push(p);
      if (out.length >= limit) break;
    }
  }
  return out;
}

export const brands = [...new Set(products.map((p) => p.brand))].sort();

const SWATCH: Record<string, string> = {
  black: "#1a1a1a",
  blue: "#2563eb",
  "deep-blue": "#1d4ed8",
  white: "#f4f4f4",
  silver: "#c0c0c0",
  gumusu: "#c0c0c0",
  gold: "#d4af37",
  green: "#16a34a",
  "dark-green": "#166534",
  purple: "#9333ea",
  violet: "#7c3aed",
  "cobalt-violet": "#6d28d9",
  red: "#dc2626",
  pink: "#ec4899",
  gray: "#6b7280",
  grey: "#6b7280",
  orange: "#f97316",
  "cosmic-orange": "#ea580c",
  titanium: "#8b8680",
  midnight: "#1e293b",
  starlight: "#f8f4ef",
};

const COLOR_TOKENS = Object.keys(SWATCH).sort((a, b) => b.length - a.length);

function familyKey(slug: string) {
  let s = slug.toLowerCase();
  for (const token of COLOR_TOKENS) {
    s = s.replaceAll(`-${token}`, "");
  }
  return s.replace(/-+/g, "-").replace(/-$/g, "");
}

function swatchOf(product: Product): string | null {
  const slug = product.slug.toLowerCase();
  for (const token of COLOR_TOKENS) {
    if (slug.includes(`-${token}`)) return SWATCH[token];
  }
  return null;
}

const swatchesByFamily = new Map<string, string[]>();
for (const product of products) {
  const swatch = swatchOf(product);
  if (!swatch) continue;
  const key = familyKey(product.slug);
  const list = swatchesByFamily.get(key) ?? [];
  if (!list.includes(swatch)) list.push(swatch);
  swatchesByFamily.set(key, list);
}

export function getCardSwatches(product: Product): string[] {
  const own = swatchOf(product);
  const family = swatchesByFamily.get(familyKey(product.slug)) ?? [];
  const ordered = own ? [own, ...family.filter((s) => s !== own)] : family;
  return ordered.slice(0, 5);
}
