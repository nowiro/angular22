import { type EnvironmentProviders, makeEnvironmentProviders, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, type Routes, withComponentInputBinding } from '@angular/router';

import { type AuthConfig, provideAuth } from '@angular22/shared-auth';
import { provideFeatureFlags } from '@angular22/shared-config';
import { provideEnTranslations } from '@angular22/shared-i18n';
import { provideA22GlobalErrorHandler } from '@angular22/ui-feedback';

/** Per-app inputs to the shared bootstrap spine. */
export interface AppPlatformConfig {
  readonly routes: Routes;
  readonly translations: Readonly<Record<string, string>>;
  /** Auth wiring; defaults to the demo mock (role `user`). Override for a real IdP. */
  readonly auth?: AuthConfig;
}

const DEFAULT_AUTH: AuthConfig = { mode: 'mock', initialRole: 'user' };

/**
 * The common provider spine every app bootstraps — global error listeners +
 * handler, runtime feature flags, auth (mock by default), router (with component
 * input binding) and EN translations. Declared once here instead of duplicated
 * across `app.config.ts`; apps add only their deltas.
 */
export function provideAppPlatform(config: AppPlatformConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideBrowserGlobalErrorListeners(),
    provideA22GlobalErrorHandler(),
    provideFeatureFlags(),
    provideAuth(config.auth ?? DEFAULT_AUTH),
    provideRouter(config.routes, withComponentInputBinding()),
    provideEnTranslations(config.translations),
  ]);
}
