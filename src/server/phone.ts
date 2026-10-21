export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("994")) return digits;
  if (digits.startsWith("0")) return `994${digits.slice(1)}`;
  return digits;
}
