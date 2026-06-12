import { describe, expect, it } from 'vitest';

import { DEFAULT_APP_CONFIG, mergeAppConfig } from './feature-flags';

describe('mergeAppConfig', () => {
  it('falls back to permissive defaults for garbage input', () => {
    expect(mergeAppConfig(null)).toEqual(DEFAULT_APP_CONFIG);
    expect(mergeAppConfig('nope')).toEqual(DEFAULT_APP_CONFIG);
    expect(mergeAppConfig({})).toEqual(DEFAULT_APP_CONFIG);
    expect(mergeAppConfig({ features: 42 })).toEqual(DEFAULT_APP_CONFIG);
  });

  it('overrides a single flag and keeps the rest from defaults', () => {
    const merged = mergeAppConfig({ features: { 'business-wizard': { enabled: false } } });
    expect(merged.features['business-wizard'].enabled).toBe(false);
    // untouched fields inherited from defaults
    expect(merged.features['business-wizard'].standaloneUrl).toBe(
      DEFAULT_APP_CONFIG.features['business-wizard'].standaloneUrl,
    );
    expect(merged.features['individual-wizard'].enabled).toBe(true);
  });

  it('overrides urls and element config per environment', () => {
    const merged = mergeAppConfig({
      features: {
        'individual-wizard': {
          standaloneUrl: 'https://demo.example.com/individual/',
          element: { scriptUrl: 'https://cdn.example.com/iw/main.js', tagName: 'a22-individual-wizard-element' },
        },
      },
    });
    expect(merged.features['individual-wizard'].standaloneUrl).toBe('https://demo.example.com/individual/');
    expect(merged.features['individual-wizard'].element?.scriptUrl).toBe('https://cdn.example.com/iw/main.js');
  });

  it('ignores malformed feature entries without dropping defaults', () => {
    const merged = mergeAppConfig({ features: { 'individual-wizard': 'broken' } });
    expect(merged.features['individual-wizard'].enabled).toBe(true);
  });
});
