/**
 * Public API for the shared-config library — runtime feature flags loaded
 * from `config.json` (per-environment enable/disable without redeploys),
 * route guard, and the web-component bundle loader.
 *
 * @packageDocumentation
 */
export { ElementLoader } from './lib/element-loader';
export { featureEnabledGuard } from './lib/feature-guard';
export { DEFAULT_APP_CONFIG, mergeAppConfig } from './lib/feature-flags';
export type { AppConfig, ElementConfig, FeatureConfig, FeatureId } from './lib/feature-flags';
export { FeatureFlagsStore, provideFeatureFlags } from './lib/feature-flags-store';
