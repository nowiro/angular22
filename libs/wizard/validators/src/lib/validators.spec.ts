import { describe, expect, it } from 'vitest';

import { ageInYears, isAdult } from './age';
import { adultAgeError, krsError, nipError, peselError, regonError } from './field-errors';
import { isValidKrs } from './krs';
import { isValidNip, normaliseNip } from './nip';
import { isValidPeselChecksum, parsePesel } from './pesel';
import { isValidPlPhone } from './phone';
import { autoFormatPostalCode, isValidPlPostalCode } from './postal-code';
import { isValidRegon } from './regon';
import { isValidWebsiteUrl } from './url';

describe('pesel', () => {
  it('accepts a valid checksum PESEL', () => {
    expect(isValidPeselChecksum('44051401359')).toBe(true);
  });

  it('rejects an invalid checksum / shape', () => {
    expect(isValidPeselChecksum('44051401358')).toBe(false);
    expect(isValidPeselChecksum('1234')).toBe(false);
    expect(isValidPeselChecksum('abcdefghijk')).toBe(false);
  });

  it('parses birth date and gender', () => {
    const info = parsePesel('44051401359');
    expect(info).not.toBeNull();
    expect(info?.birthDate.getUTCFullYear()).toBe(1944);
    expect(info?.birthDate.getUTCMonth()).toBe(4);
    expect(info?.birthDate.getUTCDate()).toBe(14);
    expect(info?.gender).toBe('male');
  });

  it('rejects invalid month encodings', () => {
    expect(parsePesel('44151401359')).toBeNull();
  });
});

describe('nip', () => {
  it('accepts valid NIPs (with separators)', () => {
    expect(isValidNip('5270103391')).toBe(true);
    expect(isValidNip('527-010-33-91')).toBe(true);
    expect(normaliseNip('527 010 33 91')).toBe('5270103391');
  });

  it('rejects invalid NIPs', () => {
    expect(isValidNip('5270103392')).toBe(false);
    expect(isValidNip('123')).toBe(false);
    expect(normaliseNip('123')).toBeNull();
  });
});

describe('regon', () => {
  it('accepts a valid REGON-9', () => {
    // weights [8,9,2,3,4,5,6,7] · digits 0..7 → 148 % 11 = 5
    expect(isValidRegon('012345675')).toBe(true);
  });

  it('rejects wrong checksum / length', () => {
    expect(isValidRegon('012345674')).toBe(false);
    expect(isValidRegon('12345')).toBe(false);
  });
});

describe('krs', () => {
  it('accepts exactly 10 digits', () => {
    expect(isValidKrs('0000123456')).toBe(true);
  });

  it('rejects other shapes', () => {
    expect(isValidKrs('123456789')).toBe(false);
    expect(isValidKrs('12345678901')).toBe(false);
    expect(isValidKrs('1234abc890')).toBe(false);
  });
});

describe('phone', () => {
  it('accepts PL phone formats', () => {
    expect(isValidPlPhone('+48 601 234 567')).toBe(true);
    expect(isValidPlPhone('601234567')).toBe(true);
    expect(isValidPlPhone('601-234-567')).toBe(true);
  });

  it('rejects non-PL shapes', () => {
    expect(isValidPlPhone('12345')).toBe(false);
    expect(isValidPlPhone('+49 601 234 567')).toBe(false);
  });
});

describe('postal-code', () => {
  it('validates NN-NNN', () => {
    expect(isValidPlPostalCode('00-950')).toBe(true);
    expect(isValidPlPostalCode('00950')).toBe(false);
  });

  it('auto-formats 5 digits', () => {
    expect(autoFormatPostalCode('00950')).toBe('00-950');
    expect(autoFormatPostalCode('00-950')).toBe('00-950');
  });
});

describe('url', () => {
  it('accepts http(s) and empty', () => {
    expect(isValidWebsiteUrl('https://example.com')).toBe(true);
    expect(isValidWebsiteUrl('')).toBe(true);
  });

  it('rejects other protocols and garbage', () => {
    expect(isValidWebsiteUrl('ftp://example.com')).toBe(false);
    expect(isValidWebsiteUrl('not a url')).toBe(false);
  });
});

describe('age', () => {
  const today = new Date(Date.UTC(2026, 5, 11));

  it('computes age in years', () => {
    expect(ageInYears(new Date(Date.UTC(2000, 5, 11)), today)).toBe(26);
    expect(ageInYears(new Date(Date.UTC(2000, 5, 12)), today)).toBe(25);
  });

  it('isAdult at the 18-year boundary', () => {
    expect(isAdult(new Date(Date.UTC(2008, 5, 11)), today)).toBe(true);
    expect(isAdult(new Date(Date.UTC(2008, 5, 12)), today)).toBe(false);
  });
});

describe('field-errors', () => {
  it('passes empty values through', () => {
    expect(peselError('')).toBeNull();
    expect(nipError('')).toBeNull();
    expect(regonError('')).toBeNull();
    expect(krsError('')).toBeNull();
    expect(adultAgeError(null)).toBeNull();
  });

  it('returns { kind, message } for invalid values', () => {
    expect(peselError('123')).toMatchObject({ kind: 'pesel' });
    expect(nipError('123')).toMatchObject({ kind: 'nip' });
    expect(regonError('123')).toMatchObject({ kind: 'regon' });
    expect(krsError('123')).toMatchObject({ kind: 'krs' });
  });
});
