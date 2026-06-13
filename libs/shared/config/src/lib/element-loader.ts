import { Injectable } from '@angular/core';

import type { ElementConfig } from './feature-flags';

/**
 * True only when `scriptUrl` is a same-origin absolute path. Canonicalizes
 * through the URL parser the same way the browser resolves `script.src`, so it
 * rejects protocol-relative (`//host`), backslash tricks (`/\host`, which the
 * URL parser normalizes to `//` and resolves cross-origin), absolute URLs, and
 * non-http(s) schemes — a raw `startsWith('/')` string check misses these.
 */
export function isSameOriginScriptPath(scriptUrl: string): boolean {
  // Reject backslashes before the parser sees them: the URL parser treats them
  // as '/', so "/\evil.com" would canonicalize to a cross-origin host.
  if (!scriptUrl.startsWith('/') || scriptUrl.includes('\\')) return false;
  try {
    return new URL(scriptUrl, location.origin).origin === location.origin;
  } catch {
    return false;
  }
}

/**
 * Loads a web-component bundle (ESM script registering a custom element) on
 * demand, once per script URL. Resolves when the custom element tag is
 * defined and ready to instantiate.
 */
@Injectable({ providedIn: 'root' })
export class ElementLoader {
  private readonly loaded = new Map<string, Promise<void>>();

  async load(element: ElementConfig): Promise<void> {
    // SECURITY: only same-origin scripts may load (XSS protection — a tampered
    // config.json could otherwise point at an attacker-controlled bundle). The
    // old raw string check was bypassable (e.g. "/\evil.com" passes a
    // startsWith('/') test but the browser resolves it cross-origin);
    // isSameOriginScriptPath canonicalizes via the URL parser instead.
    if (!isSameOriginScriptPath(element.scriptUrl)) {
      throw new Error(`ElementLoader: security policy blocks external script source: ${element.scriptUrl}`);
    }

    if (customElements.get(element.tagName) !== undefined) return;

    let pending = this.loaded.get(element.scriptUrl);
    if (pending === undefined) {
      pending = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = element.scriptUrl;
        script.addEventListener('load', () => {
          resolve();
        });
        script.addEventListener('error', () => {
          this.loaded.delete(element.scriptUrl);
          script.remove();
          reject(new Error(`ElementLoader: failed to load ${element.scriptUrl}`));
        });
        document.head.append(script);
      });
      this.loaded.set(element.scriptUrl, pending);
    }
    await pending;
    // The module may register the tag asynchronously (createApplication) —
    // wait for the definition before letting the caller create the element.
    await customElements.whenDefined(element.tagName);
  }
}
