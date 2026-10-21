export const FREE_DELIVERY_THRESHOLD = 49.99;
export const DELIVERY_FEE = 4.99;

export type PromoDef =
  | { type: "percent"; value: number }
  | { type: "freeDelivery" };

export const PROMOS: Record<string, PromoDef> = {
  KONTAKT10: { type: "percent", value: 10 },
  YENI5: { type: "percent", value: 5 },
  FREEDELIVERY: { type: "freeDelivery" },
};

export function computeCartPricing(subtotal: number, appliedPromo: string | null) {
  const code = appliedPromo?.trim().toUpperCase() || null;
  const promo = code ? PROMOS[code] : undefined;

  let discount = 0;
  if (promo?.type === "percent") {
    discount = Math.round(subtotal * (promo.value / 100) * 100) / 100;
  }

  const qualifiesFreeDelivery =
    subtotal >= FREE_DELIVERY_THRESHOLD ||
    code === "FREEDELIVERY" ||
    promo?.type === "freeDelivery";
  const deliveryFee = qualifiesFreeDelivery ? 0 : DELIVERY_FEE;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  return {
    appliedPromo: code,
    discount,
    deliveryFee,
    grandTotal,
    qualifiesFreeDelivery,
  };
}
