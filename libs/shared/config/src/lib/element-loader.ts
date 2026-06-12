import { Injectable } from '@angular/core';

import type { ElementConfig } from './feature-flags';

/**
 * Loads a web-component bundle (ESM script registering a custom element) on
 * demand, once per script URL. Resolves when the custom element tag is
 * defined and ready to instantiate.
 */
@Injectable({ providedIn: 'root' })
export class ElementLoader {
  private readonly loaded = new Map<string, Promise<void>>();

  async load(element: ElementConfig): Promise<void> {
    // SECURITY: Prevent loading cross-origin/external scripts via config manipulation (XSS protection).
    // The scriptUrl must be an absolute path starting with '/' but not '//' (protocol-relative).
    if (!element.scriptUrl.startsWith('/') || element.scriptUrl.startsWith('//')) {
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
