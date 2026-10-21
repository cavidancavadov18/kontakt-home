export function formatPrice(value: number, _locale: string = "az"): string {
  const fixed = Number.isInteger(value) ? String(value) : value.toFixed(2);
  const [intPart, dec] = fixed.split(".");
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return dec ? `${withSpaces}.${dec} ₼` : `${withSpaces} ₼`;
}

/** Live kontakt.az preview: price ÷ 24, no markup */
export function monthlyPayment(price: number, months = 24): number {
  return Math.round((price / months) * 100) / 100;
}
