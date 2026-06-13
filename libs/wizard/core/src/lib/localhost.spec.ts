import { describe, expect, it } from 'vitest';

import { isLocalhost } from './localhost';

describe('isLocalhost', () => {
  it('accepts the local hostname variants', () => {
    for (const host of ['localhost', '127.0.0.1', '[::1]', '::1']) {
      expect(isLocalhost(host)).toBe(true);
    }
  });

  it('rejects deployed origins and look-alikes', () => {
    for (const host of ['demo.example.com', 'localhost.evil.com', 'evil-localhost.com', 'notlocalhost', '']) {
      expect(isLocalhost(host)).toBe(false);
    }
  });

  it('degrades to non-local when there is no global location (node env)', () => {
    // wizard-core runs under the `node` vitest environment, so `globalThis.location`
    // is undefined and the no-arg call must fail closed rather than open.
    expect(isLocalhost()).toBe(false);
  });

  it('reads location.hostname on the no-arg path used by the dev-fill panel', () => {
    // The component calls isLocalhost() with no argument; this exercises that
    // production path by stubbing the global. `[::1]` is the bracketed form the
    // browser actually reports for IPv6 loopback (see localhost.ts).
    const global = globalThis as { location?: { hostname: string } };
    const original = global.location;
    try {
      global.location = { hostname: '[::1]' };
      expect(isLocalhost()).toBe(true);
      global.location = { hostname: 'demo.example.com' };
      expect(isLocalhost()).toBe(false);
    } finally {
      global.location = original;
    }
  });
});
