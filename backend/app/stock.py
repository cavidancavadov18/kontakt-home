"""Stock levels + per-store availability (deterministic hashes identical to the TS code)."""

from __future__ import annotations

import hashlib
import json
import os
import threading
from pathlib import Path
from typing import Any, Optional

from .db import mutate_collection, read_collection

BACKEND_DIR = Path(__file__).resolve().parent.parent


def _stores_path() -> Path:
    env = os.environ.get("STORES_PATH")
    return Path(env) if env else BACKEND_DIR / "data" / "stores.json"


_stores_lock = threading.Lock()
_stores: Optional[list[dict[str, Any]]] = None


def get_stores() -> list[dict[str, Any]]:
    global _stores
    if _stores is None:
        with _stores_lock:
            if _stores is None:
                try:
                    with open(_stores_path(), "r", encoding="utf-8-sig") as fh:
                        data = json.load(fh)
                except FileNotFoundError:
                    data = []
                _stores = [s for s in data if isinstance(s, dict)] if isinstance(data, list) else []
    return _stores


def _sha(value: str) -> bytes:
    return hashlib.sha256(value.encode("utf-8")).digest()


def hash_qty(product_id: str) -> int:
    return 5 + (_sha(product_id)[0] % 36)


def get_stock(product_id: str) -> int:
    entry = next((s for s in read_collection("stock") if s.get("productId") == product_id), None)
    if entry is None:
        return max(0, hash_qty(product_id))
    return max(0, entry["qty"] - entry["reserved"])


def reserve_stock(product_id: str, qty: float) -> dict[str, Any]:
    """Reserve ``qty`` units. Returns ``{"ok": True}`` or ``{"ok": False, "error": ...}``."""
    if qty <= 0:
        return {"ok": True}

    def _reserve(items: list[Any]) -> dict[str, Any]:
        entry = next((s for s in items if s.get("productId") == product_id), None)
        if entry is None:
            entry = {"productId": product_id, "qty": hash_qty(product_id), "reserved": 0}
            items.append(entry)
        available = entry["qty"] - entry["reserved"]
        if available < qty:
            return {"ok": False, "error": "Insufficient stock"}
        entry["reserved"] += qty
        return {"ok": True}

    return mutate_collection("stock", _reserve)


def release_stock(product_id: str, qty: float) -> None:
    if qty <= 0:
        return

    def _release(items: list[Any]) -> None:
        entry = next((s for s in items if s.get("productId") == product_id), None)
        if entry is not None:
            entry["reserved"] = max(0, entry["reserved"] - qty)

    mutate_collection("stock", _release)


def _store_count_for_product(product_id: str) -> int:
    return 3 + (_sha(f"stores:{product_id}")[1] % 3)


def _store_qty(product_id: str, store_id: str) -> int:
    return 1 + (_sha(f"{product_id}:{store_id}")[0] % 8)


def get_store_availability(product_id: str) -> list[dict[str, Any]]:
    stores = get_stores()
    if not stores:
        return []
    count = _store_count_for_product(product_id)
    start = _sha(product_id)[2] % len(stores)
    picked: list[dict[str, Any]] = []
    i = 0
    while i < len(stores) and len(picked) < count:
        picked.append(stores[(start + i) % len(stores)])
        i += 1
    return [
        {
            "id": store["id"],
            "name": store["name"],
            "qty": _store_qty(product_id, store["id"]),
            "lat": store.get("lat"),
            "lng": store.get("lng"),
        }
        for store in picked
    ]
