import { describe, expect, it } from 'vitest';

import {
  isValidKrs,
  isValidNip,
  isValidPeselChecksum,
  isValidPlPhone,
  isValidPlPostalCode,
  isValidRegon,
  parsePesel,
} from '@angular22/wizard-validators';

import { isLocalhost } from './localhost';
import {
  generateValidKrs,
  generateValidNip,
  generateValidPesel,
  generateValidRegon,
  randomPhoneNumber,
  randomPostalCode,
} from './polish-fake-data';

describe('polish-fake-data generators produce checksum-valid identifiers', () => {
  it('PESEL — valid checksum, matching birth date and gender', () => {
    for (let i = 0; i < 50; i++) {
      const birth = new Date(Date.UTC(1990, 0, 15));
      const pesel = generateValidPesel(birth, 'female');
      expect(isValidPeselChecksum(pesel)).toBe(true);
      const parsed = parsePesel(pesel);
      expect(parsed?.gender).toBe('female');
      expect(parsed?.birthDate.toISOString()).toBe(birth.toISOString());
    }
  });

  it('NIP — valid checksum', () => {
    for (let i = 0; i < 50; i++) {
      expect(isValidNip(generateValidNip())).toBe(true);
    }
  });

  it('REGON — valid checksum', () => {
    for (let i = 0; i < 50; i++) {
      expect(isValidRegon(generateValidRegon())).toBe(true);
    }
  });

  it('KRS — 10 digits', () => {
    for (let i = 0; i < 20; i++) {
      expect(isValidKrs(generateValidKrs())).toBe(true);
    }
  });

  it('phone and postal code match the PL validators', () => {
    for (let i = 0; i < 20; i++) {
      expect(isValidPlPhone(randomPhoneNumber())).toBe(true);
      expect(isValidPlPostalCode(randomPostalCode())).toBe(true);
    }
  });
});

describe('isLocalhost', () => {
  it('accepts local hostnames', () => {
    expect(isLocalhost('localhost')).toBe(true);
    expect(isLocalhost('127.0.0.1')).toBe(true);
    expect(isLocalhost('[::1]')).toBe(true);
  });

  it('rejects deployed origins', () => {
    expect(isLocalhost('example.com')).toBe(false);
    expect(isLocalhost('demo.nowiro.dev')).toBe(false);
  });
});
