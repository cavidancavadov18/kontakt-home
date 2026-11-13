"""Product catalog loaded lazily (once) from the JSON files shared with the frontend."""

from __future__ import annotations

import json
import math
import os
import re
import threading
from pathlib import Path
from typing import Any, Iterable, Optional

from .utils import js_round

BACKEND_DIR = Path(__file__).resolve().parent.parent


def _catalog_path() -> Path:
    env = os.environ.get("CATALOG_PATH")
    return Path(env) if env else (BACKEND_DIR / ".." / "src" / "data" / "catalog.json").resolve()


def _variants_path() -> Path:
    env = os.environ.get("VARIANTS_PATH")
    return Path(env) if env else (BACKEND_DIR / ".." / "src" / "data" / "phone-variants.json").resolve()


_LARGE = "https://api.kontakt.az/media/catalog/product/cache/716efda7398dc1b7904df86297088a96/"
_CACHE_PREFIX = re.compile(r"^cache/[a-f0-9]+/")
_HASH_SUFFIX = re.compile(r"-[a-f0-9]{8}(\.[a-z0-9]+)$", re.IGNORECASE)
_EXT = re.compile(r"\.[a-z0-9]+$", re.IGNORECASE)


def hi_res_image(url: str) -> str:
    """Swap Kontakt's 450px cache file for the 1216px product photo (mirrors TS hiResImage)."""
    if not url or "/catalog/product/cache/" not in url:
        return url
    parts = url.split("/catalog/product/")
    rel = parts[1] if len(parts) > 1 else ""
    if not rel:
        return url
    no_cache = _CACHE_PREFIX.sub("", rel)
    bare = _HASH_SUFFIX.sub(r"\1", no_cache)
    slash = bare.rfind("/")
    directory = bare[: slash + 1]
    stem = _EXT.sub("", bare[slash + 1 :])
    if not stem:
        return url
    return f"{_LARGE}{directory}{stem}.png"


def _with_sharp_images(p: dict[str, Any]) -> dict[str, Any]:
    image = p.get("image")
    image = hi_res_image(image) if image else image
    source = p.get("images")
    if not source:
        source = [image] if image else []
    out = dict(p)
    out["image"] = image
    out["images"] = [hi_res_image(u) for u in source]
    return out


def _normalize_item(p: dict[str, Any]) -> dict[str, Any]:
    name = p.get("name") or {"az": "", "ru": ""}
    item = dict(p)
    item["name"] = name
    item["description"] = p.get("description") or p.get("name") or {"az": "", "ru": ""}
    item["images"] = p.get("images") or ([p["image"]] if p.get("image") else [])
    item["rating"] = p.get("rating") or 4.5
    item["reviewCount"] = p.get("reviewCount") or 0
    item["specs"] = p.get("specs") or []
    return _with_sharp_images(item)


def _bundle(
    pid: str,
    slug: str,
    name: str,
    brand: str,
    image: str,
    price: float,
    old_price: float,
    online_only: bool = False,
) -> dict[str, Any]:
    hi = hi_res_image(image)
    return {
        "id": pid,
        "slug": slug,
        "name": {"az": name, "ru": name},
        "brand": brand,
        "category": "idman",
        "image": hi,
        "images": [hi],
        "price": price,
        "oldPrice": old_price,
        "discount": int(js_round((old_price - price) / old_price * 100)),
        "rating": 5,
        "reviewCount": 0,
        "badge": {"az": "yaln\u0131z onlayn", "ru": "\u0442\u043e\u043b\u044c\u043a\u043e \u043e\u043d\u043b\u0430\u0439\u043d"}
        if online_only
        else None,
        "description": {
            "az": f"{name}. Kontakt-da birlikd\u0259 daha s\u0259rf\u0259li d\u0259st, pulsuz \u00e7atd\u0131r\u0131lma.",
            "ru": f"{name}. \u041d\u0430\u0431\u043e\u0440 \u0432\u044b\u0433\u043e\u0434\u043d\u0435\u0435 \u0432\u043c\u0435\u0441\u0442\u0435, \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u0430\u044f \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0430.",
        },
        "specs": [],
    }


_IMG = "https://api.kontakt.az/media/catalog/product/cache/6282c30fc03b0f87228ba5e924bc2e0e/t/m/"


def _bundle_products() -> list[dict[str, Any]]:
    items = [
        _bundle("b-mix", "bundle-mix-aksesuar", "Bundle Mix aksesuar", "Kontakt",
                _IMG + "tm-dg-acs-1109-pb-0639_123-b0f5a231.webp", 229.99, 469.99),
        _bundle("b-razer", "gaming-set-razer", "Gaming set", "Razer",
                _IMG + "tm-dg-acs-1109-mo-1006_213-d63063d7.webp", 99.99, 284.99),
        _bundle("b-razer-p", "gaming-set-razer-premium", "Gaming set Razer Premium", "Razer",
                _IMG + "tm-dg-acs-1109-mo-1005_1212-cb2fc253.webp", 635, 949.95),
        _bundle("b-aw-mouse",
                "monitor-dell-alienware-25-aw2525hm-gaming-mouse-dell-alienware-aw620m-dark-side-of-the-moon",
                "Monitor Dell Alienware 25 AW2525HM + Gaming mouse Dell Alienware AW620M Dark Side of The Moon",
                "Dell", _IMG + "tm-dg-kot-1114-mr-0626_11-90df46da.webp", 649.99, 799.99, True),
        _bundle("b-aw-kb",
                "monitor-dell-alienware-25-aw2525hm-oyun-klaviaturasi-dell-alienware-aw920k-dark-side-of-the-moon",
                "Monitor Dell Alienware 25 AW2525HM + Oyun klaviaturas\u0131 Dell Alienware AW920K Dark Side of The Moon",
                "Dell", _IMG + "tm-dg-kot-1114-mr-0630-3b410f19.webp", 899.99, 1199.99, True),
        _bundle("b-aw-hs",
                "monitor-dell-alienware-25-aw2525hm-qulaqliq-dell-alienware-aw520h-dark-side-of-the-moon",
                "Monitor Dell Alienware 25 AW2525HM + Qulaql\u0131q Dell Alienware AW520H Dark Side of The Moon",
                "Dell", _IMG + "tm-dg-kot-1114-mr-0629-c82cc30a.webp", 649.99, 799.99, True),
        _bundle("b-aw-k2",
                "monitor-dell-alienware-25-aw2525hm-oyun-klaviaturasi-dell-alienware-aw420k-qwerty",
                "Monitor Dell Alienware 25 AW2525HM + Oyun klaviaturas\u0131 Dell Alienware AW420K Qwerty",
                "Dell", _IMG + "tm-dg-kot-1114-mr-0628-454bce43.webp", 749.99, 999.99, True),
    ]
    # TS leaves `badge` undefined (omitted from JSON) for non-online-only bundles.
    for item in items:
        if item["badge"] is None:
            del item["badge"]
    return items


def _load_json_list(path: Path, required: bool) -> list[dict[str, Any]]:
    try:
        with open(path, "r", encoding="utf-8-sig") as fh:
            data = json.load(fh)
    except FileNotFoundError:
        if required:
            raise
        return []
    return [p for p in data if isinstance(p, dict)] if isinstance(data, list) else []


_lock = threading.Lock()
_products: Optional[list[dict[str, Any]]] = None
_by_id: dict[str, dict[str, Any]] = {}
_by_slug: dict[str, dict[str, Any]] = {}


def _load() -> None:
    global _products, _by_id, _by_slug
    if _products is not None:
        return
    with _lock:
        if _products is not None:
            return
        from_catalog = [_normalize_item(p) for p in _load_json_list(_catalog_path(), True)]
        catalog_slugs = {p.get("slug") for p in from_catalog}
        variants = [
            _normalize_item(p)
            for p in _load_json_list(_variants_path(), False)
            if p.get("slug") and p["slug"] not in catalog_slugs
        ]
        bundles = [p for p in _bundle_products() if p["slug"] not in catalog_slugs]
        merged = [*from_catalog, *variants, *bundles]

        by_id: dict[str, dict[str, Any]] = {}
        by_slug: dict[str, dict[str, Any]] = {}
        for p in merged:
            pid = p.get("id")
            if pid is not None:
                by_id.setdefault(str(pid), p)
            slug = p.get("slug")
            if slug:
                by_slug.setdefault(slug, p)
        _by_id, _by_slug = by_id, by_slug
        _products = merged  # assigned last so concurrent readers never see a half-built index


def get_all_products() -> list[dict[str, Any]]:
    _load()
    assert _products is not None
    return _products


def get_product(id_or_slug: str) -> Optional[dict[str, Any]]:
    """Look a product up by id first, then by slug."""
    _load()
    return _by_id.get(id_or_slug) or _by_slug.get(id_or_slug)


def find_product(product_id: Optional[str], slug: Optional[str]) -> Optional[dict[str, Any]]:
    """Match ``id == product_id`` or ``slug == slug`` (id wins when both resolve)."""
    _load()
    if product_id and product_id in _by_id:
        return _by_id[product_id]
    if slug and slug in _by_slug:
        return _by_slug[slug]
    return None


def get_products_by_ids(ids: Iterable[str]) -> list[dict[str, Any]]:
    """Products whose id is in ``ids``, in catalog order."""
    wanted = set(ids)
    if not wanted:
        return []
    return [p for p in get_all_products() if str(p.get("id")) in wanted]


def _contains(value: Any, q: str) -> bool:
    return isinstance(value, str) and q in value.lower()


def search_products(q: str = "", page: int = 1, limit: int = 20) -> dict[str, Any]:
    """Paginated admin search over id/slug/name/brand/sku."""
    needle = (q or "").strip().lower()
    page = max(1, int(page))
    limit = min(100, max(1, int(limit)))

    products = get_all_products()
    if needle:
        filtered = [
            p
            for p in products
            if _contains(str(p.get("id", "")), needle)
            or _contains(p.get("slug"), needle)
            or _contains((p.get("name") or {}).get("az"), needle)
            or _contains((p.get("name") or {}).get("ru"), needle)
            or _contains(p.get("brand"), needle)
            or _contains(p.get("sku"), needle)
        ]
    else:
        filtered = products

    total = len(filtered)
    start = (page - 1) * limit
    items = []
    for p in filtered[start : start + limit]:
        row = {
            "id": p.get("id"),
            "slug": p.get("slug"),
            "name": p.get("name"),
            "brand": p.get("brand"),
            "category": p.get("category"),
            "price": p.get("price"),
            "image": p.get("image"),
        }
        if p.get("sku") is not None:
            row["sku"] = p["sku"]
        items.append(row)

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": max(1, math.ceil(total / limit)),
    }
