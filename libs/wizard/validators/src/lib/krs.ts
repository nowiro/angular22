/**
 * KRS (National Court Register) number validation. KRS is exactly 10 digits
 * with no checksum (it's a sequential registry number, not a control-digit
 * scheme like NIP or REGON).
 */
export function isValidKrs(value: string): boolean {
  const digits = value.replaceAll(/\s+/g, '');
  return /^\d{10}$/.test(digits);
}
