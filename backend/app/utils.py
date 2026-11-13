"""Small helpers that mimic the JavaScript semantics the TS routes relied on."""

from __future__ import annotations

import json
import math
from typing import Any

from fastapi import Request


class ApiError(Exception):
    """Raised by routes/dependencies; rendered as ``{"error": message}``."""

    def __init__(self, status_code: int, message: str) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.message = message


class JsonBody:
    """Lazily parsed request body so auth checks can run before JSON validation."""

    def __init__(self, raw: bytes) -> None:
        self._raw = raw

    def parse(self) -> dict[str, Any]:
        """Parse the JSON body. Raises 400 ``Invalid JSON``; non-objects become ``{}``."""
        try:
            parsed = json.loads(self._raw.decode("utf-8") if self._raw else "")
        except (ValueError, UnicodeDecodeError):
            raise ApiError(400, "Invalid JSON")
        return parsed if isinstance(parsed, dict) else {}

    def parse_lenient(self) -> dict[str, Any]:
        """Like ``parse`` but returns ``{}`` instead of raising."""
        try:
            return self.parse()
        except ApiError:
            return {}


async def get_json_body(request: Request) -> JsonBody:
    return JsonBody(await request.body())


def text(value: Any) -> str:
    """Return a string for str/int/float values, otherwise ''."""
    if isinstance(value, str):
        return value
    if isinstance(value, bool):
        return ""
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float) and math.isfinite(value):
        return str(int(value)) if value.is_integer() else str(value)
    return ""


def trimmed(value: Any) -> str:
    return text(value).strip()


def js_number(value: Any) -> float:
    """Approximation of JavaScript's ``Number(value)`` (NaN for unparseable input)."""
    if value is None:
        return 0.0
    if isinstance(value, bool):
        return 1.0 if value else 0.0
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        s = value.strip()
        if s == "":
            return 0.0
        try:
            return float(s)
        except ValueError:
            return math.nan
    return math.nan


def is_finite(value: float) -> bool:
    return math.isfinite(value)


def js_round(value: float) -> float:
    """``Math.round`` semantics (half rounds towards +infinity)."""
    return float(math.floor(value + 0.5))


def tidy_number(value: float) -> int | float:
    """Return ints for integral floats so JSON output stays tidy."""
    if math.isfinite(value) and float(value).is_integer():
        return int(value)
    return value
