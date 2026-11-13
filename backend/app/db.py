"""Thread-safe JSON-file database (same layout as the TypeScript implementation)."""

from __future__ import annotations

import json
import os
import random
import threading
import time
from pathlib import Path
from typing import Any, Callable, TypeVar

COLLECTIONS: tuple[str, ...] = (
    "users",
    "sessions",
    "otps",
    "orders",
    "reviews",
    "addresses",
    "tickets",
    "stock",
    "oneClick",
)

_BACKEND_DIR = Path(__file__).resolve().parent.parent
DB_DIR: Path = Path(
    os.environ.get("KH_DB_DIR") or (_BACKEND_DIR.parent / "data" / "db")
)

# A single re-entrant lock serialises every read / write / read-modify-write.
_lock = threading.RLock()

T = TypeVar("T")


def ensure_db_dir() -> None:
    DB_DIR.mkdir(parents=True, exist_ok=True)


def _file_path(name: str) -> Path:
    if name not in COLLECTIONS:
        raise ValueError(f"Unknown collection: {name}")
    return DB_DIR / f"{name}.json"


def _read_raw(name: str) -> list[Any]:
    ensure_db_dir()
    fp = _file_path(name)
    try:
        with open(fp, "r", encoding="utf-8") as fh:
            parsed = json.load(fh)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []
    return parsed if isinstance(parsed, list) else []


def _write_raw(name: str, data: list[Any]) -> None:
    ensure_db_dir()
    fp = _file_path(name)
    tmp = fp.with_name(f"{fp.name}.{os.getpid()}.{int(time.time() * 1000)}.tmp")
    payload = json.dumps(data, indent=2, ensure_ascii=False)
    with open(tmp, "w", encoding="utf-8") as fh:
        fh.write(payload)
    os.replace(tmp, fp)


def read_collection(name: str) -> list[Any]:
    with _lock:
        return _read_raw(name)


def write_collection(name: str, data: list[Any]) -> None:
    with _lock:
        _write_raw(name, data)


def mutate_collection(name: str, fn: Callable[[list[Any]], T]) -> T:
    """Read the collection, run ``fn(items)`` (which may mutate in place) and persist."""
    with _lock:
        items = _read_raw(name)
        result = fn(items)
        _write_raw(name, items)
        return result


_BASE36 = "0123456789abcdefghijklmnopqrstuvwxyz"


def _to_base36(num: int) -> str:
    if num == 0:
        return "0"
    out = []
    while num > 0:
        num, rem = divmod(num, 36)
        out.append(_BASE36[rem])
    return "".join(reversed(out))


def new_id(prefix: str) -> str:
    ts = _to_base36(int(time.time() * 1000))
    rnd = "".join(random.choice(_BASE36) for _ in range(6))
    return f"{prefix}-{ts}-{rnd}"


def init_empty_collections() -> None:
    with _lock:
        ensure_db_dir()
        for name in COLLECTIONS:
            if not _file_path(name).exists():
                _write_raw(name, [])
