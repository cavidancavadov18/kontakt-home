"""Session + admin cookie handling (token format compatible with the TS implementation)."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time
from typing import Any, Optional

from fastapi import Request

from .db import mutate_collection, new_id, read_collection
from .utils import ApiError

SESSION_COOKIE = "kh_session"
ADMIN_COOKIE = "kh_admin"

SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000
ADMIN_TTL_MS = 12 * 60 * 60 * 1000

ADMIN_USERS: dict[str, str] = {
    "superadmin": "admin",
    "admin": "admin",
}


def _secret() -> bytes:
    return (os.environ.get("KH_SECRET") or "kontakt-dev-secret-change-me").encode("utf-8")


def _is_production() -> bool:
    return (
        os.environ.get("NODE_ENV") == "production"
        or os.environ.get("ENV") == "production"
    )


def b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def b64url_decode(data: str) -> bytes:
    padded = data + "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(padded.encode("ascii"))


def _signature(payload: str) -> str:
    digest = hmac.new(_secret(), payload.encode("utf-8"), hashlib.sha256).digest()
    return b64url_encode(digest)


def sign(payload: str) -> str:
    return f"{payload}.{_signature(payload)}"


def verify_token(token: str) -> Optional[str]:
    """Return the payload (base64url string) if the signature is valid, else None."""
    dot = token.rfind(".")
    if dot <= 0:
        return None
    payload = token[:dot]
    sig = token[dot + 1 :]
    expected = _signature(payload)
    try:
        if not hmac.compare_digest(sig.encode("utf-8"), expected.encode("utf-8")):
            return None
    except Exception:
        return None
    return payload


def _encode_payload(obj: dict[str, Any]) -> str:
    return b64url_encode(json.dumps(obj, separators=(",", ":"), ensure_ascii=False).encode("utf-8"))


def _decode_payload(payload_b64: str) -> Optional[dict[str, Any]]:
    try:
        parsed = json.loads(b64url_decode(payload_b64).decode("utf-8"))
    except Exception:
        return None
    return parsed if isinstance(parsed, dict) else None


def _now_ms() -> int:
    return int(time.time() * 1000)


def iso_from_ms(ms: int) -> str:
    secs, millis = divmod(ms, 1000)
    return time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime(secs)) + f".{millis:03d}Z"


def iso_now() -> str:
    return iso_from_ms(_now_ms())


# --------------------------------------------------------------------------- #
# Cookie kwargs (use with ``response.set_cookie(**kwargs)``)
# --------------------------------------------------------------------------- #


def _cookie_kwargs(key: str, value: str, max_age: int) -> dict[str, Any]:
    return {
        "key": key,
        "value": value,
        "max_age": max_age,
        "path": "/",
        "httponly": True,
        "samesite": "lax",
        "secure": _is_production(),
    }


def session_cookie_kwargs(token: str) -> dict[str, Any]:
    return _cookie_kwargs(SESSION_COOKIE, token, SESSION_TTL_MS // 1000)


def clear_session_cookie_kwargs() -> dict[str, Any]:
    return _cookie_kwargs(SESSION_COOKIE, "", 0)


def admin_cookie_kwargs(token: str) -> dict[str, Any]:
    return _cookie_kwargs(ADMIN_COOKIE, token, ADMIN_TTL_MS // 1000)


def clear_admin_cookie_kwargs() -> dict[str, Any]:
    return _cookie_kwargs(ADMIN_COOKIE, "", 0)


def set_session_cookie(response: Any, token: str) -> None:
    response.set_cookie(**session_cookie_kwargs(token))


def clear_session_cookie(response: Any) -> None:
    response.set_cookie(**clear_session_cookie_kwargs())


def set_admin_cookie(response: Any, token: str) -> None:
    response.set_cookie(**admin_cookie_kwargs(token))


def clear_admin_cookie(response: Any) -> None:
    response.set_cookie(**clear_admin_cookie_kwargs())


# --------------------------------------------------------------------------- #
# User sessions
# --------------------------------------------------------------------------- #


def create_session(user_id: str) -> str:
    session_id = new_id("sess")
    now = _now_ms()
    record = {
        "id": session_id,
        "userId": user_id,
        "createdAt": iso_from_ms(now),
        "expiresAt": iso_from_ms(now + SESSION_TTL_MS),
    }
    mutate_collection("sessions", lambda sessions: sessions.append(record))
    return sign(_encode_payload({"sid": session_id}))


def parse_iso_ms(value: Any) -> float:
    from datetime import datetime

    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).timestamp() * 1000
    except ValueError:
        return 0.0


def _session_id_from_token(token: str) -> Optional[str]:
    payload_b64 = verify_token(token)
    if not payload_b64:
        return None
    parsed = _decode_payload(payload_b64)
    if not parsed:
        return None
    sid = parsed.get("sid")
    return sid if isinstance(sid, str) else None


def _resolve_session(token: str) -> Optional[dict[str, Any]]:
    sid = _session_id_from_token(token)
    if not sid:
        return None
    session = next((s for s in read_collection("sessions") if s.get("id") == sid), None)
    if not session:
        return None
    if parse_iso_ms(session.get("expiresAt")) < _now_ms():
        def _remove(items: list[Any]) -> None:
            for idx, s in enumerate(items):
                if s.get("id") == sid:
                    del items[idx]
                    break

        mutate_collection("sessions", _remove)
        return None
    return session


def get_session_user(request: Request) -> Optional[dict[str, Any]]:
    """Return the user dict for the current ``kh_session`` cookie or None."""
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        return None
    session = _resolve_session(token)
    if not session:
        return None
    return next(
        (u for u in read_collection("users") if u.get("id") == session.get("userId")),
        None,
    )


def destroy_session(request: Request) -> None:
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        return
    sid = _session_id_from_token(token)
    if not sid:
        return

    def _remove(items: list[Any]) -> None:
        for idx, s in enumerate(items):
            if s.get("id") == sid:
                del items[idx]
                break

    mutate_collection("sessions", _remove)


# --------------------------------------------------------------------------- #
# Admin
# --------------------------------------------------------------------------- #


def login_admin(username: str, password: str) -> Optional[str]:
    """Return a signed admin token for valid credentials, else None."""
    user = username.strip().lower()
    expected = ADMIN_USERS.get(user)
    if expected is None:
        return None
    if not hmac.compare_digest(expected.encode("utf-8"), password.encode("utf-8")):
        return None
    payload = _encode_payload({"u": user, "exp": _now_ms() + ADMIN_TTL_MS})
    return sign(payload)


def get_admin(request: Request) -> Optional[dict[str, str]]:
    """Return ``{"username": ...}`` for a valid ``kh_admin`` cookie, else None."""
    token = request.cookies.get(ADMIN_COOKIE)
    if not token:
        return None
    payload_b64 = verify_token(token)
    if not payload_b64:
        return None
    parsed = _decode_payload(payload_b64)
    if not parsed:
        return None
    user = parsed.get("u")
    exp = parsed.get("exp")
    if not isinstance(user, str) or not user:
        return None
    if isinstance(exp, bool) or not isinstance(exp, (int, float)) or not exp:
        return None
    if exp < _now_ms():
        return None
    if user not in ADMIN_USERS:
        return None
    return {"username": user}


def require_admin(request: Request) -> dict[str, str]:
    """FastAPI dependency: 401 ``{"error": "Unauthorized"}`` unless admin cookie is valid."""
    admin = get_admin(request)
    if not admin:
        raise ApiError(401, "Unauthorized")
    return admin
