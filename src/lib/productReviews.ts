import type { Product } from "@/data/products";
import type { Locale } from "@/i18n/dictionaries";

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

const STORAGE_PREFIX = "kh-reviews-";

function storageKey(slug: string) {
  return `${STORAGE_PREFIX}${slug}`;
}

function seedReviews(product: Product, locale: Locale): ProductReview[] {
  const name = product.name[locale];
  const seeds =
    locale === "az"
      ? [
          {
            author: "Elvin M.",
            rating: 5,
            text: `${name} gözlədiyimdən yaxşıdır, çatdırılma sürətli oldu.`,
          },
          {
            author: "Aysel K.",
            rating: 4,
            text: "Qiymət/performans balansı əladır. Mağazada da eyni modeli görmüşdüm.",
          },
          {
            author: "Rəşad T.",
            rating: 5,
            text: "Kontakt Home-dan alışım rahat keçdi, qutu tam idi.",
          },
          {
            author: "Ləman H.",
            rating: 4,
            text: "Zəmanət və ödəniş şərtləri aydındır, məsləhət görərəm.",
          },
        ]
      : [
          {
            author: "Эльвин М.",
            rating: 5,
            text: `${name} оправдал ожидания, доставка быстрая.`,
          },
          {
            author: "Айsel К.",
            rating: 4,
            text: "Отличное соотношение цены и качества.",
          },
          {
            author: "Рашад Т.",
            rating: 5,
            text: "Покупка в Kontakt Home прошла без проблем, комплектация полная.",
          },
        ];

  const base = new Date();
  return seeds.map((s, i) => ({
    id: `seed-${i}`,
    ...s,
    date: new Date(base.getTime() - (i + 2) * 86400000).toISOString(),
  }));
}

export function loadProductReviews(
  product: Product,
  locale: Locale
): ProductReview[] {
  if (typeof window === "undefined") {
    return seedReviews(product, locale);
  }
  try {
    const raw = localStorage.getItem(storageKey(product.slug));
    if (!raw) return seedReviews(product, locale);
    const parsed = JSON.parse(raw) as ProductReview[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seedReviews(product, locale);
    }
    return parsed;
  } catch {
    return seedReviews(product, locale);
  }
}

export function persistProductReviews(slug: string, reviews: ProductReview[]) {
  localStorage.setItem(storageKey(slug), JSON.stringify(reviews));
}

export function addProductReview(
  slug: string,
  review: Omit<ProductReview, "id" | "date">
): ProductReview[] {
  const existing = (() => {
    try {
      const raw = localStorage.getItem(storageKey(slug));
      if (!raw) return [] as ProductReview[];
      return JSON.parse(raw) as ProductReview[];
    } catch {
      return [] as ProductReview[];
    }
  })();

  const entry: ProductReview = {
    ...review,
    id: `user-${Date.now()}`,
    date: new Date().toISOString(),
  };
  const next = [entry, ...existing];
  persistProductReviews(slug, next);
  return next;
}
