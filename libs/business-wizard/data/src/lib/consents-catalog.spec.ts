import { describe, expect, it } from 'vitest';

import { applicableConsents } from './consents-catalog';
import { initialBusinessData } from './models';

function keys(items: readonly { key: string }[]): string[] {
  return items.map((item) => item.key);
}

describe('business consents catalog', () => {
  it('IT/b2b company gets base + optional consents only', () => {
    const data = initialBusinessData();
    const items = keys(applicableConsents(data));
    expect(items).toEqual(['terms-of-service', 'gdpr-processing', 'marketing-b2b', 'partner-sharing', 'newsletter']);
  });

  it('finance industry adds the PSD2 disclosure', () => {
    const data = initialBusinessData();
    data.profile.industry = 'finance';
    expect(keys(applicableConsents(data))).toContain('psd2-disclosure');
  });

  it('healthcare industry adds the DPA confirmation', () => {
    const data = initialBusinessData();
    data.profile.industry = 'healthcare';
    expect(keys(applicableConsents(data))).toContain('healthcare-dpa');
  });

  it('b2c segments add the consumer privacy notice', () => {
    const data = initialBusinessData();
    data.profile.customerSegment = 'b2c';
    expect(keys(applicableConsents(data))).toContain('b2c-privacy-notice');
    data.profile.customerSegment = 'b2b-b2c';
    expect(keys(applicableConsents(data))).toContain('b2c-privacy-notice');
  });

  it('export flag adds the sanctions oath', () => {
    const data = initialBusinessData();
    data.profile.hasExport = true;
    expect(keys(applicableConsents(data))).toContain('export-sanctions');
  });

  it('preserves granted flags across rebuilds', () => {
    const data = initialBusinessData();
    data.consents.items = applicableConsents(data).map((item) =>
      item.key === 'newsletter' ? { ...item, granted: true } : item,
    );
    data.profile.industry = 'finance';
    const rebuilt = applicableConsents(data);
    expect(rebuilt.find((item) => item.key === 'newsletter')?.granted).toBe(true);
  });
});
