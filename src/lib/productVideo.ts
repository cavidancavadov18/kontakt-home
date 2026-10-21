import type { Product } from "@/data/products";

/**
 * YouTube IDs verified from kontakt.az product video modal (+ channel).
 * Fallback IDs are public product demos that allow embedding.
 */
const VIDEOS = {
  iphone: "yrONKayXmqc",
  kontakt: "T3w0qOvH5_o",
  samsung: "T3w0qOvH5_o",
  xiaomi: "T3w0qOvH5_o",
  appliances: "T3w0qOvH5_o",
  promo: "yrONKayXmqc",
} as const;

export function youtubeIdForProduct(product: Product): string {
  const key = `${product.slug} ${product.brand} ${product.name.az}`.toLowerCase();

  if (/iphone|ipad|macbook|airpods|apple/.test(key)) return VIDEOS.iphone;
  if (/samsung|galaxy/.test(key)) return VIDEOS.samsung;
  if (/xiaomi|redmi|poco/.test(key)) return VIDEOS.xiaomi;
  if (
    product.category === "ev-texnikasi" ||
    product.category === "metbex-texnikasi" ||
    /televizor|tozsoran|paltaryuyan|qabyuyan/.test(key)
  ) {
    return VIDEOS.appliances;
  }

  return VIDEOS.kontakt;
}

export const promoVideoIds = VIDEOS;
