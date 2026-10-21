import type { Product } from "@/data/products";

export type ColorOption = {
  id: string;
  label: { az: string; ru: string };
  swatch: string;
  image: string;
};

export type MemoryOption = {
  id: string;
  label: string;
  priceDelta: number;
};

const COLOR_META: Record<
  string,
  { label: { az: string; ru: string }; swatch: string }
> = {
  black: { label: { az: "Qara", ru: "Чёрный" }, swatch: "#1a1a1a" },
  blue: { label: { az: "Göy", ru: "Синий" }, swatch: "#2563eb" },
  white: { label: { az: "Ağ", ru: "Белый" }, swatch: "#f5f5f5" },
  silver: { label: { az: "Gümüşü", ru: "Серебро" }, swatch: "#c0c0c0" },
  gold: { label: { az: "Qızılı", ru: "Золото" }, swatch: "#d4af37" },
  green: { label: { az: "Yaşıl", ru: "Зелёный" }, swatch: "#16a34a" },
  purple: { label: { az: "Bənövşəyi", ru: "Фиолетовый" }, swatch: "#9333ea" },
  red: { label: { az: "Qırmızı", ru: "Красный" }, swatch: "#dc2626" },
  pink: { label: { az: "Çəhrayı", ru: "Розовый" }, swatch: "#ec4899" },
  gray: { label: { az: "Boz", ru: "Серый" }, swatch: "#6b7280" },
  grey: { label: { az: "Boz", ru: "Серый" }, swatch: "#6b7280" },
  titanium: { label: { az: "Titan", ru: "Титан" }, swatch: "#8b8680" },
  midnight: { label: { az: "Gecə", ru: "Полночь" }, swatch: "#1e293b" },
  starlight: { label: { az: "Starlight", ru: "Starlight" }, swatch: "#f8f4ef" },
};

const FALLBACK_SWATCHES = [
  "#e5004d",
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#d4af37",
  "#1a1a1a",
];

function colorWordFromText(text: string): string | null {
  const t = text.toLowerCase();
  for (const key of Object.keys(COLOR_META)) {
    if (new RegExp(`\\b${key}\\b`).test(t)) return key;
  }
  return null;
}

export function getColorOptions(product: Product): ColorOption[] {
  const imgs = product.images.length ? product.images : [product.image];
  if (imgs.length <= 1) return [];

  const slugColor = colorWordFromText(product.slug);
  const used = new Set<string>();

  return imgs.map((image, i) => {
    let key = slugColor && i === 0 ? slugColor : colorWordFromText(image);
    if (!key || used.has(key)) {
      key = `idx-${i}`;
    } else {
      used.add(key);
    }

    const meta = COLOR_META[key];
    const swatch = meta?.swatch ?? FALLBACK_SWATCHES[i % FALLBACK_SWATCHES.length];
    const label = meta?.label ?? {
      az: `Rəng ${i + 1}`,
      ru: `Цвет ${i + 1}`,
    };

    return { id: `color-${i}`, label, swatch, image };
  });
}

function parseStorageGb(product: Product): number | null {
  const fromName = product.name.az.match(/(\d+)\s*\/\s*(\d+)\s*GB/i);
  if (fromName) return parseInt(fromName[2], 10);

  const fromSlug = product.slug.match(/-(\d+)-gb(?:-|$)/i);
  if (fromSlug) return parseInt(fromSlug[1], 10);

  const slashSlug = product.slug.match(/-(\d+)-(\d+)-gb/i);
  if (slashSlug) return parseInt(slashSlug[2], 10);

  return null;
}

const STORAGE_TIERS = [128, 256, 512, 1024] as const;

export function getMemoryOptions(product: Product): MemoryOption[] {
  const base = parseStorageGb(product);
  const isPhoneLike =
    product.category === "smartfonlar" ||
    /iphone|galaxy|redmi|pixel|smartfon/i.test(product.slug);

  if (!isPhoneLike) {
    return [];
  }

  const center = base && STORAGE_TIERS.includes(base as (typeof STORAGE_TIERS)[number])
    ? base
    : 256;

  const idx = STORAGE_TIERS.indexOf(center as (typeof STORAGE_TIERS)[number]);
  const start = Math.max(0, idx - 1);
  const end = Math.min(STORAGE_TIERS.length, idx + 2);
  const tiers = STORAGE_TIERS.slice(start, end);

  return tiers.map((gb) => ({
    id: `mem-${gb}`,
    label: `${gb} GB`,
    priceDelta: Math.round((gb - center) * 0.45),
  }));
}
