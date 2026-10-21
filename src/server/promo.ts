import { computeCartPricing, PROMOS } from "@/lib/cartPricing";

export type PromoValidation =
  | {
      valid: true;
      code: string;
      discount: number;
      deliveryFee: number;
      grandTotal: number;
      qualifiesFreeDelivery: boolean;
    }
  | { valid: false; code: string | null; error: string };

export function validatePromo(code: string | null | undefined, subtotal: number): PromoValidation {
  const normalized = code?.trim().toUpperCase() || null;
  if (!normalized) {
    return { valid: false, code: null, error: "Promo code required" };
  }
  if (!PROMOS[normalized]) {
    return { valid: false, code: normalized, error: "Unknown promo code" };
  }
  const pricing = computeCartPricing(subtotal, normalized);
  return {
    valid: true,
    code: normalized,
    discount: pricing.discount,
    deliveryFee: pricing.deliveryFee,
    grandTotal: pricing.grandTotal,
    qualifiesFreeDelivery: pricing.qualifiesFreeDelivery,
  };
}
