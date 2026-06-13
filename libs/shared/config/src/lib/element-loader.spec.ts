// @vitest-environment jsdom
// ElementLoader resolves scriptUrl against `location` and touches
// `customElements`/`document`, so this suite needs a browser-like DOM (the
// lib's default test environment is node).
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ElementLoader, isSameOriginScriptPath } from './element-loader';

describe('isSameOriginScriptPath', () => {
  it('accepts same-origin absolute paths', () => {
    expect(isSameOriginScriptPath('/elements/demo-individual-wizard/main.js')).toBe(true);
    expect(isSameOriginScriptPath('/elements/x/main.js?v=2')).toBe(true);
  });

  it('rejects protocol-relative and backslash bypasses', () => {
    // Both resolve cross-origin once the browser parses them — the old
    // startsWith('/') check let the backslash variant through.
    expect(isSameOriginScriptPath('//evil.com/x.js')).toBe(false);
    expect(isSameOriginScriptPath('/\\evil.com/x.js')).toBe(false);
    expect(isSameOriginScriptPath('/\\/evil.com/x.js')).toBe(false);
  });

  it('rejects absolute URLs, dangerous schemes and relative paths', () => {
    expect(isSameOriginScriptPath('https://evil.com/x.js')).toBe(false);
    expect(isSameOriginScriptPath('javascript:alert(1)')).toBe(false);
    expect(isSameOriginScriptPath('data:text/javascript,alert(1)')).toBe(false);
    expect(isSameOriginScriptPath('elements/x.js')).toBe(false);
    expect(isSameOriginScriptPath('')).toBe(false);
  });

  it('keeps an encoded slash same-origin (not a real bypass)', () => {
    // %2F stays part of the path, so the origin is unchanged — must NOT be rejected.
    expect(isSameOriginScriptPath('/%2F%2Fevil.com/x.js')).toBe(true);
  });
});

describe('ElementLoader security gate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects cross-origin scriptUrl variants', async () => {
    const loader = new ElementLoader();
    await expect(loader.load({ scriptUrl: '/\\evil.com/x.js', tagName: 'a22-x' })).rejects.toThrow(/security policy/);
    await expect(loader.load({ scriptUrl: '//evil.com/x.js', tagName: 'a22-x' })).rejects.toThrow(/security policy/);
    await expect(loader.load({ scriptUrl: 'https://evil.com/x.js', tagName: 'a22-x' })).rejects.toThrow(
      /security policy/,
    );
  });

  it('passes the gate for a same-origin path (already-defined tag short-circuits load)', async () => {
    const loader = new ElementLoader();
    vi.spyOn(customElements, 'get').mockReturnValue(class extends HTMLElement {});
    await expect(loader.load({ scriptUrl: '/elements/x/main.js', tagName: 'a22-defined' })).resolves.toBeUndefined();
  });
});
