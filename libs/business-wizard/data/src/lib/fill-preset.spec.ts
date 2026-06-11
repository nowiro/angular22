import { describe, expect, it } from 'vitest';

import { isValidKrs, isValidNip, isValidRegon } from '@angular22/wizard-validators';

import { buildBusinessPreset } from './fill-preset';

describe('buildBusinessPreset', () => {
  it('required mode fills checksum-valid identifiers and a headquarters address', () => {
    const data = buildBusinessPreset('required');
    expect(data.companyBasics.legalName).not.toBe('');
    expect(isValidNip(data.companyBasics.nip)).toBe(true);
    expect(isValidRegon(data.companyBasics.regon)).toBe(true);
    expect(isValidKrs(data.companyBasics.krs)).toBe(true);
    expect(data.contact.addresses[0].purpose).toBe('headquarters');
    expect(data.representatives.items.length).toBe(1);
    expect(data.meta.acceptTerms).toBe(true);
    expect(data.consents.items.filter((c) => c.required).every((c) => c.granted)).toBe(true);
  });

  it('max mode forces the maximum consent load (finance + b2c + export)', () => {
    const data = buildBusinessPreset('max');
    const keys = data.consents.items.map((item) => item.key);
    expect(keys).toContain('psd2-disclosure');
    expect(keys).toContain('b2c-privacy-notice');
    expect(keys).toContain('export-sanctions');
    expect(data.contact.addresses.length).toBe(2);
    expect(data.representatives.items.length).toBe(2);
    expect(data.consents.items.every((c) => c.granted)).toBe(true);
  });
});
