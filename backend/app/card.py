import re
from datetime import datetime
from typing import Optional

_NON_DIGITS = re.compile(r"\D", re.ASCII)
_EXPIRY = re.compile(r"^([0-9]{2})/([0-9]{2})$")


def luhn_ok(num: str) -> bool:
    d = _NON_DIGITS.sub("", num)
    if len(d) < 16 or len(d) > 19:
        return False
    if len(set(d)) == 1:
        return False
    total = 0
    alt = False
    for ch in reversed(d):
        n = ord(ch) - 48
        if n < 0 or n > 9:
            return False
        if alt:
            n *= 2
            if n > 9:
                n -= 9
        total += n
        alt = not alt
    return total % 10 == 0


def expiry_ok(exp: str, now: Optional[datetime] = None) -> bool:
    m = _EXPIRY.match(exp.strip())
    if not m:
        return False
    month = int(m.group(1))
    year = 2000 + int(m.group(2))
    if month < 1 or month > 12:
        return False
    # First day of the month *after* the expiry month (cards are valid through month end).
    first_invalid = datetime(year + 1, 1, 1) if month == 12 else datetime(year, month + 1, 1)
    return first_invalid > (now or datetime.now())
