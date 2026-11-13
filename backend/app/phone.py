import re

_NON_DIGITS = re.compile(r"\D", re.ASCII)


def normalize_phone(phone: str) -> str:
    digits = _NON_DIGITS.sub("", phone)
    if digits.startswith("994"):
        return digits
    if digits.startswith("0"):
        return f"994{digits[1:]}"
    return digits
