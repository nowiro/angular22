import { effect, inject, Injectable, InjectionToken, signal } from '@angular/core';
import type { Provider } from '@angular/core';

import { COMMON_EN } from './translations-common.en';

/**
 * Signal-based runtime i18n. Polish is the DEFAULT and source language —
 * Polish UI strings ARE the translation keys (gettext-style), so templates
 * stay readable and a missing English entry safely falls back to Polish.
 */
export type AppLanguage = 'pl' | 'en';

const STORAGE_KEY = 'a22.lang';

/** English translation maps (PL string → EN string), contributed per app/feature. */
export const A22_TRANSLATIONS_EN = new InjectionToken<readonly Readonly<Record<string, string>>[]>(
  'A22_TRANSLATIONS_EN',
);

/** Registers an app/feature-level English map (multi-provider, merged by the store). */
export function provideEnTranslations(map: Readonly<Record<string, string>>): Provider {
  return { provide: A22_TRANSLATIONS_EN, useValue: map, multi: true };
}

function readInitialLanguage(): AppLanguage {
  try {
    return globalThis.localStorage?.getItem(STORAGE_KEY) === 'en' ? 'en' : 'pl';
  } catch {
    return 'pl';
  }
}

@Injectable({ providedIn: 'root' })
export class I18nStore {
  private readonly contributed = inject(A22_TRANSLATIONS_EN, { optional: true }) ?? [];
  private readonly en: Readonly<Record<string, string>> = this.contributed.reduce<Record<string, string>>(
    (merged, map) => ({ ...merged, ...map }),
    { ...COMMON_EN },
  );

  /** Active UI language — Polish by default, persisted across sessions. */
  readonly language = signal<AppLanguage>(readInitialLanguage());

  constructor() {
    effect(() => {
      const lang = this.language();
      try {
        globalThis.localStorage?.setItem(STORAGE_KEY, lang);
      } catch {
        // Storage unavailable (private mode) — language stays session-only.
      }
      globalThis.document?.documentElement.setAttribute('lang', lang);
    });
  }

  setLanguage(lang: AppLanguage): void {
    this.language.set(lang);
  }

  /**
   * Translates a Polish source string. Reactive: reads the language signal,
   * so `computed()`s and templates re-evaluate on switch.
   */
  t(text: string): string {
    if (this.language() === 'pl') return text;
    return this.en[text] ?? text;
  }
}
