// Normalizes a free-form phone number (as entered in Admin Settings) into a wa.me URL.
// Accepts +90..., 0..., spaces, dashes, dots and parentheses. Returns null when the
// result isn't a plausible phone number, so callers can simply not render the button.
export function normalizeWhatsAppUrl(raw: string | undefined | null, defaultMessage?: string): string | null {
  if (!raw) return null;

  let digits = raw.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "90" + digits.slice(1);
  if (!digits.startsWith("90") && digits.length === 10) digits = "90" + digits;

  if (!/^\d{10,15}$/.test(digits)) return null;

  const base = `https://wa.me/${digits}`;
  return defaultMessage ? `${base}?text=${encodeURIComponent(defaultMessage)}` : base;
}
