"""Kontakt Home FastAPI backend - replaces the Next.js ``/api`` routes."""

from __future__ import annotations

import math
import os
import re
import secrets
import time
from contextlib import asynccontextmanager
from typing import Any, Optional

from fastapi import Depends, FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from . import catalog
from .auth import (
    clear_admin_cookie,
    clear_session_cookie,
    create_session,
    destroy_session,
    get_admin,
    get_session_user,
    iso_from_ms,
    iso_now,
    login_admin,
    parse_iso_ms,
    require_admin,
    set_admin_cookie,
    set_session_cookie,
)
from .card import expiry_ok, luhn_ok
from .db import init_empty_collections, mutate_collection, new_id, read_collection
from .phone import normalize_phone
from .pricing import compute_cart_pricing, validate_promo
from .stock import get_stock, get_store_availability, release_stock, reserve_stock
from .utils import (
    ApiError,
    JsonBody,
    get_json_body,
    is_finite,
    js_number,
    js_round,
    text,
    tidy_number,
    trimmed,
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_empty_collections()
    yield


app = FastAPI(title="Kontakt Home API", lifespan=lifespan)

_cors_env = (os.environ.get("CORS_ORIGINS") or "*").strip()
if _cors_env == "*":
    # allow_origins=["*"] cannot be combined with credentials in browsers; the regex
    # makes Starlette echo back the request Origin, which is what credentialed CORS needs.
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=".*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in _cors_env.split(",") if o.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# --------------------------------------------------------------------------- #
# Error handling: always {"error": "..."}
# --------------------------------------------------------------------------- #


@app.exception_handler(ApiError)
async def _api_error_handler(_: Request, exc: ApiError) -> JSONResponse:
    return JSONResponse({"error": exc.message}, status_code=exc.status_code)


@app.exception_handler(StarletteHTTPException)
async def _http_error_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse(
        {"error": str(exc.detail)}, status_code=exc.status_code, headers=getattr(exc, "headers", None)
    )


@app.exception_handler(RequestValidationError)
async def _validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse({"error": "Invalid request"}, status_code=400)


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #

PAYMENT_METHODS = ("cash", "card", "installment")


def _public_user(user: dict[str, Any]) -> dict[str, Any]:
    return {"id": user["id"], "phone": user["phone"], "name": user["name"]}


def _sorted_desc(items: list[Any]) -> list[Any]:
    return sorted(items, key=lambda x: x.get("createdAt", ""), reverse=True)


def _txn_id() -> str:
    # TS: `txn-${newId("pay").slice(4)}`
    return f"txn-{new_id('pay')[4:]}"


def _remove_by_id(name: str, item_id: str) -> bool:
    def _remove(items: list[Any]) -> bool:
        for idx, item in enumerate(items):
            if item.get("id") == item_id:
                del items[idx]
                return True
        return False

    return mutate_collection(name, _remove)


def _number_or(value: Optional[str], default: int) -> int:
    n = js_number(value)
    if not is_finite(n) or n == 0:
        return default
    return int(n)


# --------------------------------------------------------------------------- #
# Health
# --------------------------------------------------------------------------- #


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": True}


# --------------------------------------------------------------------------- #
# Auth
# --------------------------------------------------------------------------- #

OTP_TTL_MS = 10 * 60 * 1000


@app.post("/api/auth/otp/send")
def otp_send(body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()
    raw_phone = text(payload.get("phone"))
    phone = normalize_phone(raw_phone) if raw_phone else ""
    if len(phone) < 9:
        raise ApiError(400, "Invalid phone")

    code = str(1000 + secrets.randbelow(9000))
    expires_ms = int(time.time() * 1000) + OTP_TTL_MS
    record = {"phone": phone, "code": code, "expiresAt": iso_from_ms(expires_ms)}

    def _upsert(otps: list[Any]) -> None:
        for idx, o in enumerate(otps):
            if o.get("phone") == phone:
                otps[idx] = record
                return
        otps.append(record)

    mutate_collection("otps", _upsert)
    return {"ok": True, "code": code}


@app.post("/api/auth/otp/verify")
def otp_verify(response: Response, body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()
    raw_phone = text(payload.get("phone"))
    phone = normalize_phone(raw_phone) if raw_phone else ""
    code = trimmed(payload.get("code"))
    if not phone or not code:
        raise ApiError(400, "Phone and code required")

    otp = next((o for o in read_collection("otps") if o.get("phone") == phone), None)
    if not otp or otp.get("code") != code:
        raise ApiError(401, "Invalid code")
    if parse_iso_ms(otp.get("expiresAt")) < time.time() * 1000:
        raise ApiError(401, "Code expired")

    def _drop_otp(items: list[Any]) -> None:
        for idx, o in enumerate(items):
            if o.get("phone") == phone:
                del items[idx]
                return

    mutate_collection("otps", _drop_otp)

    name = trimmed(payload.get("name"))

    def _upsert_user(users: list[Any]) -> dict[str, Any]:
        user = next((u for u in users if u.get("phone") == phone), None)
        if user is None:
            user = {
                "id": new_id("usr"),
                "phone": phone,
                "name": name,
                "createdAt": iso_now(),
            }
            users.append(user)
        elif name:
            user["name"] = name
        return dict(user)

    user = mutate_collection("users", _upsert_user)

    token = create_session(user["id"])
    set_session_cookie(response, token)
    return {"user": _public_user(user)}


@app.post("/api/auth/logout")
def logout(request: Request, response: Response) -> dict[str, Any]:
    destroy_session(request)
    clear_session_cookie(response)
    return {"ok": True}


@app.get("/api/auth/me")
def me(request: Request) -> dict[str, Any]:
    user = get_session_user(request)
    if not user:
        raise ApiError(401, "Unauthorized")
    return {"user": _public_user(user)}


# --------------------------------------------------------------------------- #
# Orders
# --------------------------------------------------------------------------- #


@app.get("/api/orders")
def list_orders(request: Request) -> dict[str, Any]:
    user = get_session_user(request)
    if not user:
        raise ApiError(401, "Unauthorized")
    orders = [
        o
        for o in read_collection("orders")
        if o.get("phone") == user["phone"] or o.get("userId") == user["id"]
    ]
    return {"orders": orders}


@app.post("/api/orders", status_code=201)
def create_order(request: Request, body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()

    items = payload.get("items")
    customer = payload.get("customer")
    customer = customer if isinstance(customer, dict) else {}
    cust_phone = text(customer.get("phone"))
    cust_name = text(customer.get("name"))
    if not isinstance(items, list) or not items or not cust_phone or not cust_name:
        raise ApiError(400, "Missing required fields")

    user = get_session_user(request)
    phone = normalize_phone(cust_phone)

    payment = payload.get("payment")
    payment = payment if isinstance(payment, dict) else {}
    method = payment.get("method")
    if method not in PAYMENT_METHODS:
        raise ApiError(400, "Invalid payment method")

    # Validate every line before touching stock.
    lines: list[tuple[dict[str, Any], int | float]] = []
    for line in items:
        line = line if isinstance(line, dict) else {}
        product_id = text(line.get("productId"))
        product = catalog.find_product(product_id, None) if product_id else None
        qty = js_number(line.get("qty"))
        if not product or not is_finite(qty) or qty < 1:
            raise ApiError(400, f"Invalid item: {product_id or 'undefined'}")
        lines.append((product, tidy_number(qty)))

    order_items: list[dict[str, Any]] = []
    reserved: list[tuple[str, int | float]] = []
    subtotal: float = 0
    for product, qty in lines:
        result = reserve_stock(str(product["id"]), qty)
        if not result["ok"]:
            for pid, q in reserved:  # roll back earlier reservations
                release_stock(pid, q)
            raise ApiError(409, f"Out of stock: {product['slug']}")
        reserved.append((str(product["id"]), qty))
        order_items.append(
            {
                "productId": product["id"],
                "slug": product["slug"],
                "name": product["name"]["az"],
                "qty": qty,
                "unitPrice": product["price"],
            }
        )
        subtotal += product["price"] * qty

    subtotal = js_round(subtotal * 100) / 100
    promo_code = payload.get("promoCode")
    promo = validate_promo(text(promo_code) if promo_code else None, subtotal)
    if promo["valid"]:
        discount, delivery_fee, total = promo["discount"], promo["deliveryFee"], promo["grandTotal"]
    else:
        fallback = compute_cart_pricing(subtotal, None)
        discount, delivery_fee, total = (
            fallback["discount"],
            fallback["deliveryFee"],
            fallback["grandTotal"],
        )

    order_payment: dict[str, Any] = {"method": method}
    months = payment.get("installmentMonths")
    if months is not None:
        order_payment["installmentMonths"] = months
    order_payment["status"] = "pending" if method == "card" else "paid"
    if method != "card":
        order_payment["transactionId"] = _txn_id()

    order = {
        "id": f"KH-{str(int(time.time() * 1000))[-8:]}",
        "userId": user["id"] if user else None,
        "phone": phone,
        "createdAt": iso_now(),
        "locale": "ru" if payload.get("locale") == "ru" else "az",
        "items": order_items,
        "customer": {
            "name": cust_name.strip(),
            "phone": phone,
            "city": trimmed(customer.get("city")),
            "address": trimmed(customer.get("address")),
            "note": trimmed(customer.get("note")),
        },
        "payment": order_payment,
        "subtotal": subtotal,
        "discount": discount,
        "deliveryFee": delivery_fee,
        "total": total,
        "promoCode": promo["code"] if promo["valid"] else None,
        "stockReserved": True,
    }

    mutate_collection("orders", lambda orders: orders.insert(0, order))
    return {"order": order}


@app.get("/api/orders/{order_id}")
def get_order(order_id: str, request: Request) -> dict[str, Any]:
    user = get_session_user(request)
    order = next((o for o in read_collection("orders") if o.get("id") == order_id), None)
    if not order:
        raise ApiError(404, "Not found")
    if not user:
        raise ApiError(401, "Unauthorized")
    if not (order.get("userId") == user["id"] or order.get("phone") == user["phone"]):
        raise ApiError(403, "Forbidden")
    return {"order": order}


# --------------------------------------------------------------------------- #
# Payment / promo
# --------------------------------------------------------------------------- #


@app.post("/api/payment/charge")
def payment_charge(body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()
    order_id = text(payload.get("orderId"))
    if not order_id:
        raise ApiError(400, "orderId required")

    method = payload.get("method")
    if method == "card":
        card = payload.get("card")
        card = card if isinstance(card, dict) else {}
        digits = re.sub(r"\D", "", text(card.get("number")), flags=re.ASCII)
        cvv = re.sub(r"\D", "", text(card.get("cvv")), flags=re.ASCII)
        if not luhn_ok(digits) or not expiry_ok(text(card.get("expiry"))) or len(cvv) < 3:
            raise ApiError(400, "Invalid card")

    transaction_id = _txn_id()

    def _charge(orders: list[Any]) -> bool:
        order = next((o for o in orders if o.get("id") == order_id), None)
        if order is None:
            return False
        order["payment"]["status"] = "paid"
        order["payment"]["transactionId"] = transaction_id
        if method in PAYMENT_METHODS:
            order["payment"]["method"] = method
        return True

    if not mutate_collection("orders", _charge):
        raise ApiError(404, "Order not found")
    return {"ok": True, "transactionId": transaction_id}


@app.post("/api/promo/validate")
def promo_validate(body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()
    subtotal = js_number(payload.get("subtotal")) if "subtotal" in payload else math.nan
    if not is_finite(subtotal) or subtotal < 0:
        raise ApiError(400, "Invalid subtotal")
    code = payload.get("code")
    return validate_promo(text(code) if code else None, subtotal)


# --------------------------------------------------------------------------- #
# Addresses
# --------------------------------------------------------------------------- #


@app.get("/api/addresses")
def list_addresses(request: Request) -> dict[str, Any]:
    user = get_session_user(request)
    if not user:
        raise ApiError(401, "Unauthorized")
    return {"addresses": [a for a in read_collection("addresses") if a.get("userId") == user["id"]]}


@app.put("/api/addresses")
def save_address(request: Request, body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    user = get_session_user(request)
    if not user:
        raise ApiError(401, "Unauthorized")

    payload = body.parse()
    label = trimmed(payload.get("label"))
    city = trimmed(payload.get("city"))
    line = trimmed(payload.get("line"))
    if not label or not city or not line:
        raise ApiError(400, "label, city, line required")

    address_id = text(payload.get("id"))
    is_default = payload.get("isDefault")
    user_id = user["id"]

    def _save(addresses: list[Any]) -> dict[str, Any]:
        if is_default:
            for a in addresses:
                if a.get("userId") == user_id:
                    a["isDefault"] = False

        if address_id:
            existing = next(
                (a for a in addresses if a.get("id") == address_id and a.get("userId") == user_id),
                None,
            )
            if existing is not None:
                existing["label"] = label
                existing["city"] = city
                existing["line"] = line
                if is_default is not None:
                    existing["isDefault"] = bool(is_default)
                return dict(existing)

        saved = {
            "id": new_id("addr"),
            "userId": user_id,
            "label": label,
            "city": city,
            "line": line,
            "isDefault": bool(is_default)
            if is_default is not None
            else all(a.get("userId") != user_id for a in addresses),
            "createdAt": iso_now(),
        }
        addresses.append(saved)
        return dict(saved)

    return {"address": mutate_collection("addresses", _save)}


@app.delete("/api/addresses")
def delete_address(request: Request, body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    user = get_session_user(request)
    if not user:
        raise ApiError(401, "Unauthorized")

    address_id = request.query_params.get("id") or text(body.parse_lenient().get("id"))
    if not address_id:
        raise ApiError(400, "id required")

    def _remove(addresses: list[Any]) -> bool:
        for idx, a in enumerate(addresses):
            if a.get("id") == address_id and a.get("userId") == user["id"]:
                del addresses[idx]
                return True
        return False

    if not mutate_collection("addresses", _remove):
        raise ApiError(404, "Not found")
    return {"ok": True}


# --------------------------------------------------------------------------- #
# One-click orders
# --------------------------------------------------------------------------- #


@app.post("/api/one-click", status_code=201)
def one_click(request: Request, body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()
    name = trimmed(payload.get("name"))
    raw_phone = trimmed(payload.get("phone"))
    product_id = text(payload.get("productId"))
    if not name or not raw_phone or not product_id:
        raise ApiError(400, "Missing fields")

    slug = text(payload.get("slug"))
    product = catalog.find_product(product_id, slug or None)
    if not product:
        raise ApiError(404, "Product not found")

    user = get_session_user(request)
    record = {
        "id": new_id("oc"),
        "name": name,
        "phone": normalize_phone(raw_phone),
        "productId": product["id"],
        "slug": slug or product["slug"],
        "productName": trimmed(payload.get("productName")) or product["name"]["az"],
        "createdAt": iso_now(),
    }
    mutate_collection("oneClick", lambda items: items.insert(0, record))
    return {"ok": True, "order": record, "userId": user["id"] if user else None}


# --------------------------------------------------------------------------- #
# Products / reviews / stock / chat
# --------------------------------------------------------------------------- #


@app.get("/api/products")
def products_by_ids(ids: Optional[str] = None) -> dict[str, Any]:
    id_list = [s.strip() for s in (ids or "").split(",") if s.strip()]
    if not id_list:
        return {"items": []}
    return {"items": catalog.get_products_by_ids(id_list)}


@app.get("/api/reviews/{slug}")
def list_reviews(slug: str) -> dict[str, Any]:
    reviews = [r for r in read_collection("reviews") if r.get("slug") == slug]
    return {"reviews": _sorted_desc(reviews)}


@app.post("/api/reviews/{slug}", status_code=201)
def create_review(
    slug: str, request: Request, body: JsonBody = Depends(get_json_body)
) -> dict[str, Any]:
    payload = body.parse()
    rating = js_number(payload.get("rating"))
    review_text = trimmed(payload.get("text"))
    if not review_text or not is_finite(rating) or rating < 1 or rating > 5:
        raise ApiError(400, "Invalid review")

    user = get_session_user(request)
    author = (
        trimmed(payload.get("author"))
        or (user.get("name") if user else "")
        or (user.get("phone") if user else "")
        or "Guest"
    )
    review = {
        "id": new_id("rev"),
        "slug": slug,
        "author": author,
        "rating": tidy_number(rating),
        "text": review_text,
        "createdAt": iso_now(),
    }
    mutate_collection("reviews", lambda reviews: reviews.insert(0, review))
    return {"review": review}


@app.get("/api/stock/{product_id}")
def product_stock(product_id: str) -> dict[str, Any]:
    product = catalog.get_product(product_id)
    if not product:
        raise ApiError(404, "Product not found")
    qty = get_stock(str(product["id"]))
    stores = [
        {"id": s["id"], "name": s["name"], "qty": s["qty"]}
        for s in get_store_availability(str(product["id"]))
    ]
    return {"qty": qty, "stores": stores}


@app.post("/api/chat/ticket", status_code=201)
def chat_ticket(request: Request, body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()
    message = trimmed(payload.get("message"))
    if not message:
        raise ApiError(400, "message required")

    user = get_session_user(request)
    raw_phone = text(payload.get("phone"))
    phone: Optional[str] = (
        normalize_phone(raw_phone) if raw_phone else (user["phone"] if user else None)
    )
    ticket = {
        "id": new_id("tkt"),
        "message": message,
        "phone": phone,
        "userId": user["id"] if user else None,
        "createdAt": iso_now(),
        "status": "open",
    }
    mutate_collection("tickets", lambda tickets: tickets.insert(0, ticket))
    return {"ok": True, "ticket": ticket}


# --------------------------------------------------------------------------- #
# Admin
# --------------------------------------------------------------------------- #


@app.post("/api/admin/login")
def admin_login(response: Response, body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()
    username = trimmed(payload.get("username"))
    password = payload.get("password")
    password = password if isinstance(password, str) else ""
    if not username or not password:
        raise ApiError(400, "Missing credentials")

    token = login_admin(username, password)
    if not token:
        raise ApiError(401, "Invalid credentials")

    set_admin_cookie(response, token)
    return {"ok": True, "username": username.strip().lower()}


@app.post("/api/admin/logout")
def admin_logout(response: Response) -> dict[str, Any]:
    clear_admin_cookie(response)
    return {"ok": True}


@app.get("/api/admin/me")
def admin_me(request: Request) -> dict[str, Any]:
    admin = get_admin(request)
    if not admin:
        raise ApiError(401, "Unauthorized")
    return {"username": admin["username"]}


@app.get("/api/admin/stats", dependencies=[Depends(require_admin)])
def admin_stats() -> dict[str, Any]:
    orders = read_collection("orders")
    return {
        "orders": len(orders),
        "users": len(read_collection("users")),
        "openTickets": len([t for t in read_collection("tickets") if t.get("status") == "open"]),
        "oneClick": len(read_collection("oneClick")),
        "reviews": len(read_collection("reviews")),
        "pendingPayments": len(
            [o for o in orders if (o.get("payment") or {}).get("status") == "pending"]
        ),
    }


@app.get("/api/admin/orders", dependencies=[Depends(require_admin)])
def admin_orders() -> dict[str, Any]:
    return {"orders": _sorted_desc(read_collection("orders"))}


@app.patch("/api/admin/orders/{order_id}", dependencies=[Depends(require_admin)])
def admin_update_order(order_id: str, body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()
    payment = payload.get("payment")
    status = payment.get("status") if isinstance(payment, dict) else None
    if status not in ("paid", "pending"):
        raise ApiError(400, "payment.status must be paid|pending")
    note = payload.get("note")

    def _update(orders: list[Any]) -> Optional[dict[str, Any]]:
        found = next((o for o in orders if o.get("id") == order_id), None)
        if found is None:
            return None
        found["payment"]["status"] = status
        if status == "paid" and not found["payment"].get("transactionId"):
            found["payment"]["transactionId"] = _txn_id()
        if isinstance(note, str):
            found["customer"]["note"] = note.strip()
        return dict(found)

    order = mutate_collection("orders", _update)
    if order is None:
        raise ApiError(404, "Order not found")
    return {"order": order}


@app.get("/api/admin/products", dependencies=[Depends(require_admin)])
def admin_products(
    q: Optional[str] = None, page: Optional[str] = None, limit: Optional[str] = None
) -> dict[str, Any]:
    return catalog.search_products(
        q or "",
        max(1, _number_or(page, 1)),
        min(100, max(1, _number_or(limit, 20))),
    )


@app.get("/api/admin/users", dependencies=[Depends(require_admin)])
def admin_users() -> dict[str, Any]:
    return {"users": _sorted_desc(read_collection("users"))}


@app.get("/api/admin/reviews", dependencies=[Depends(require_admin)])
def admin_reviews() -> dict[str, Any]:
    return {"reviews": _sorted_desc(read_collection("reviews"))}


@app.delete("/api/admin/reviews/{review_id}", dependencies=[Depends(require_admin)])
def admin_delete_review(review_id: str) -> dict[str, Any]:
    if not _remove_by_id("reviews", review_id):
        raise ApiError(404, "Review not found")
    return {"ok": True}


@app.get("/api/admin/tickets", dependencies=[Depends(require_admin)])
def admin_tickets() -> dict[str, Any]:
    return {"tickets": _sorted_desc(read_collection("tickets"))}


@app.patch("/api/admin/tickets/{ticket_id}", dependencies=[Depends(require_admin)])
def admin_update_ticket(
    ticket_id: str, body: JsonBody = Depends(get_json_body)
) -> dict[str, Any]:
    payload = body.parse()
    status = payload.get("status")
    if status not in ("open", "closed"):
        raise ApiError(400, "status must be open|closed")

    def _update(tickets: list[Any]) -> Optional[dict[str, Any]]:
        found = next((t for t in tickets if t.get("id") == ticket_id), None)
        if found is None:
            return None
        found["status"] = status
        return dict(found)

    ticket = mutate_collection("tickets", _update)
    if ticket is None:
        raise ApiError(404, "Ticket not found")
    return {"ticket": ticket}


@app.get("/api/admin/one-click", dependencies=[Depends(require_admin)])
def admin_one_click() -> dict[str, Any]:
    return {"oneClick": _sorted_desc(read_collection("oneClick"))}


@app.delete("/api/admin/one-click/{record_id}", dependencies=[Depends(require_admin)])
def admin_delete_one_click(record_id: str) -> dict[str, Any]:
    if not _remove_by_id("oneClick", record_id):
        raise ApiError(404, "Not found")
    return {"ok": True}


@app.get("/api/admin/stock", dependencies=[Depends(require_admin)])
def admin_stock() -> dict[str, Any]:
    return {"stock": read_collection("stock")}


@app.patch("/api/admin/stock", dependencies=[Depends(require_admin)])
def admin_update_stock(body: JsonBody = Depends(get_json_body)) -> dict[str, Any]:
    payload = body.parse()
    product_id = trimmed(payload.get("productId"))
    if not product_id:
        raise ApiError(400, "productId required")

    qty = js_number(payload.get("qty"))
    reserved = js_number(payload.get("reserved"))
    if not is_finite(qty) or qty < 0 or not is_finite(reserved) or reserved < 0:
        raise ApiError(400, "qty and reserved must be non-negative numbers")

    def _update(items: list[Any]) -> dict[str, Any]:
        found = next((s for s in items if s.get("productId") == product_id), None)
        if found is None:
            found = {"productId": product_id, "qty": 0, "reserved": 0}
            items.append(found)
        found["qty"] = math.floor(qty)
        found["reserved"] = math.floor(reserved)
        return dict(found)

    return {"entry": mutate_collection("stock", _update)}
