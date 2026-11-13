from __future__ import annotations

from typing import Any, Optional

from .utils import js_round

FREE_DELIVERY_THRESHOLD = 49.99
DELIVERY_FEE = 4.99

PROMOS: dict[str, dict[str, Any]] = {
    "KONTAKT10": {"type": "percent", "value": 10},
    "YENI5": {"type": "percent", "value": 5},
    "FREEDELIVERY": {"type": "freeDelivery"},
}


def _normalize_code(code: Optional[str]) -> Optional[str]:
    if not isinstance(code, str):
        return None
    return code.strip().upper() or None


def compute_cart_pricing(subtotal: float, applied_promo: Optional[str]) -> dict[str, Any]:
    code = _normalize_code(applied_promo)
    promo = PROMOS.get(code) if code else None

    discount: float = 0
    if promo and promo["type"] == "percent":
        discount = js_round(subtotal * (promo["value"] / 100) * 100) / 100

    qualifies_free_delivery = (
        subtotal >= FREE_DELIVERY_THRESHOLD
        or code == "FREEDELIVERY"
        or bool(promo and promo["type"] == "freeDelivery")
    )
    delivery_fee = 0 if qualifies_free_delivery else DELIVERY_FEE
    grand_total = max(0, subtotal - discount + delivery_fee)

    return {
        "appliedPromo": code,
        "discount": discount,
        "deliveryFee": delivery_fee,
        "grandTotal": grand_total,
        "qualifiesFreeDelivery": qualifies_free_delivery,
    }


def validate_promo(code: Optional[str], subtotal: float) -> dict[str, Any]:
    normalized = _normalize_code(code)
    if not normalized:
        return {"valid": False, "code": None, "error": "Promo code required"}
    if normalized not in PROMOS:
        return {"valid": False, "code": normalized, "error": "Unknown promo code"}
    pricing = compute_cart_pricing(subtotal, normalized)
    return {
        "valid": True,
        "code": normalized,
        "discount": pricing["discount"],
        "deliveryFee": pricing["deliveryFee"],
        "grandTotal": pricing["grandTotal"],
        "qualifiesFreeDelivery": pricing["qualifiesFreeDelivery"],
    }
