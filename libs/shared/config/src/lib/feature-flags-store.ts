import { Injectable, signal } from '@angular/core';
import type { EnvironmentProviders } from '@angular/core';
import { inject, provideAppInitializer } from '@angular/core';

import type { AppConfig, FeatureConfig, FeatureId } from './feature-flags';
import { DEFAULT_APP_CONFIG, mergeAppConfig } from './feature-flags';

/**
 * Signal store over the runtime `config.json`. Loaded once at bootstrap via
 * {@link provideFeatureFlags}; a missing/broken file falls back to
 * {@link DEFAULT_APP_CONFIG} (everything enabled) so dev servers work with
 * zero configuration.
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagsStore {
  private readonly state = signal<AppConfig>(DEFAULT_APP_CONFIG);

  /** Full, merged runtime configuration. */
  readonly config = this.state.asReadonly();

  feature(id: FeatureId): FeatureConfig {
    return this.state().features[id];
  }

  isEnabled(id: FeatureId): boolean {
    return this.state().features[id]?.enabled ?? false;
  }

  /** Replaces the configuration (called by the app initializer). */
  load(config: AppConfig): void {
    this.state.set(config);
  }
}

/**
 * Fetches `config.json` (same-origin, next to `index.html`) before the app
 * starts and feeds it into {@link FeatureFlagsStore}.
 *
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideFeatureFlags(), …],
 * };
 * ```
 */
export function provideFeatureFlags(configUrl = 'config.json'): EnvironmentProviders {
  return provideAppInitializer(async () => {
    const store = inject(FeatureFlagsStore);
    try {
      const response = await fetch(configUrl, { cache: 'no-store' });
      if (!response.ok) return; // keep permissive defaults
      store.load(mergeAppConfig(await response.json()));
    } catch {
      // Network/JSON failure — keep permissive defaults (dev-friendly).
    }
  });
}
