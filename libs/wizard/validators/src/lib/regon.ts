/**
 * REGON checksum validation (GUS spec).
 *
 * Supports both REGON-9 (sole proprietorships, simple partnerships) and
 * REGON-14 (legal persons with branches).
 */

export function isValidRegon(value: string): boolean {
  const digits = value.replaceAll(/\s+/g, '');
  if (digits.length !== 9 && digits.length !== 14) return false;
  if (!/^\d+$/.test(digits)) return false;

  if (digits.length === 9) return checksumRegon9(digits);
  // REGON-14 = REGON-9 + 5-digit branch + 14th checksum.
  return checksumRegon9(digits.slice(0, 9)) && checksumRegon14(digits);
}

function checksumRegon9(digits: string): boolean {
  const weights = [8, 9, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number.parseInt(digits[i], 10) * (weights[i] ?? 0);
  const expected = sum % 11 === 10 ? 0 : sum % 11;
  return expected === Number.parseInt(digits[8], 10);
}

function checksumRegon14(digits: string): boolean {
  const weights = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
  let sum = 0;
  for (let i = 0; i < 13; i++) sum += Number.parseInt(digits[i], 10) * (weights[i] ?? 0);
  const expected = sum % 11 === 10 ? 0 : sum % 11;
  return expected === Number.parseInt(digits[13], 10);
}
