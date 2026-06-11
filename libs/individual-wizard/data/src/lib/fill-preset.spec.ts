import { describe, expect, it } from 'vitest';

import { isValidNip, isValidPeselChecksum, parsePesel } from '@angular22/wizard-validators';

import { buildIndividualPreset } from './fill-preset';
import { relevanceOf } from './relevance';

describe('buildIndividualPreset', () => {
  it('required mode fills the mandatory core with checksum-valid PESEL', () => {
    const data = buildIndividualPreset('required');
    expect(data.basicData.firstName).not.toBe('');
    expect(isValidPeselChecksum(data.basicData.pesel)).toBe(true);
    expect(data.basicData.dateOfBirth?.toISOString()).toBe(parsePesel(data.basicData.pesel)?.birthDate.toISOString());
    expect(data.contact.addresses[0].purpose).toBe('residence');
    expect(data.meta.acceptTerms).toBe(true);
    // required consents granted, optional ones not
    expect(data.consents.items.filter((c) => c.required).every((c) => c.granted)).toBe(true);
    expect(data.consents.items.some((c) => !c.required && !c.granted)).toBe(true);
  });

  it('all mode activates higher education and employment details', () => {
    const data = buildIndividualPreset('all');
    const relevance = relevanceOf(data);
    expect(relevance.higherEducation).toBe(true);
    expect(relevance.employmentDetails).toBe(true);
    expect(relevance.thesis).toBe(false);
    expect(data.consents.items.every((c) => c.granted)).toBe(true);
  });

  it('max mode forces the deepest shape: thesis + self-employment + NIP', () => {
    const data = buildIndividualPreset('max');
    const relevance = relevanceOf(data);
    expect(relevance.thesis).toBe(true);
    expect(data.survey.higherEducation.specialisation.thesis.keywords.length).toBeGreaterThanOrEqual(3);
    expect(data.survey.employment.status).toBe('self-employed');
    expect(isValidNip(data.basicData.nip)).toBe(true);
    expect(data.contact.addresses.length).toBe(2);
    expect(data.survey.employment.details.contracts.length).toBe(2);
  });
});
