import { describe, expect, it } from 'vitest';

import { applicableConsents, consentContextOf } from './consents-catalog';
import { initialIndividualData } from './models';

function keys(items: readonly { key: string }[]): string[] {
  return items.map((item) => item.key);
}

describe('consents catalog', () => {
  it('PL citizen gets GDPR base + PL extension + KRD/BIK, no CCPA', () => {
    const data = initialIndividualData();
    const items = keys(applicableConsents(data));
    expect(items).toContain('gdpr-base');
    expect(items).toContain('gdpr-extended-pl');
    expect(items).toContain('krd-bik');
    expect(items).not.toContain('ccpa-base');
  });

  it('US citizen gets CCPA, loses PL-specific consents', () => {
    const data = initialIndividualData();
    data.basicData.citizenship = 'US';
    data.contact.addresses[0].country = 'US';
    const items = keys(applicableConsents(data));
    expect(items).toContain('ccpa-base');
    expect(items).not.toContain('gdpr-extended-pl');
    expect(items).not.toContain('krd-bik');
  });

  it('employment consent appears only for employed/self-employed', () => {
    const data = initialIndividualData();
    expect(keys(applicableConsents(data))).not.toContain('employer-verification');
    data.survey.employment.status = 'employed';
    expect(keys(applicableConsents(data))).toContain('employer-verification');
  });

  it('thesis consent appears only when the thesis branch is active', () => {
    const data = initialIndividualData();
    expect(keys(applicableConsents(data))).not.toContain('thesis-publication');
    data.survey.educationLevel = 'phd';
    data.survey.higherEducation.field = 'IT';
    data.survey.higherEducation.specialisation.branch = 'security';
    expect(keys(applicableConsents(data))).toContain('thesis-publication');
  });

  it('preserves granted flags across rebuilds', () => {
    const data = initialIndividualData();
    data.consents.items = applicableConsents(data).map((item) =>
      item.key === 'marketing-email' ? { ...item, granted: true } : item,
    );
    data.survey.employment.status = 'employed';
    const rebuilt = applicableConsents(data);
    expect(rebuilt.find((item) => item.key === 'marketing-email')?.granted).toBe(true);
  });

  it('consentContextOf derives the residence country', () => {
    const data = initialIndividualData();
    data.contact.addresses[0].country = 'DE';
    expect(consentContextOf(data).residenceCountry).toBe('DE');
  });
});
