/**
 * Runtime feature flags — loaded from `config.json` next to `index.html`
 * BEFORE the app bootstraps. Each environment ships its own `config.json`
 * (no rebuild needed), so apps can be enabled/disabled per environment
 * without removing them from the hosting.
 */

/** Stable feature ids — also the keys of `config.json#features`. */
export type FeatureId = 'individual-wizard' | 'business-wizard';

/** Description of one embeddable web-component bundle. */
export interface ElementConfig {
  /** ESM bundle that registers the custom element (script type="module"). */
  readonly scriptUrl: string;
  /** Custom element tag registered by the bundle. */
  readonly tagName: string;
}

export interface FeatureConfig {
  /** Master switch — `false` hides tiles AND blocks routes/access. */
  readonly enabled: boolean;
  /** Standalone deployment URL (opened in a new browser tab). */
  readonly standaloneUrl: string;
  /** Web-component bundle for in-portal embedding (omit to disable embedding). */
  readonly element?: ElementConfig;
}

export interface AppConfig {
  readonly features: Readonly<Record<FeatureId, FeatureConfig>>;
}

/**
 * Safe defaults used when `config.json` is missing or malformed — everything
 * enabled, dev-server URLs. Keeping the fallback permissive means a broken
 * config file degrades to "all features on" instead of a dead portal.
 */
export const DEFAULT_APP_CONFIG: AppConfig = {
  features: {
    'individual-wizard': {
      enabled: true,
      standaloneUrl: 'http://localhost:4201/',
      element: {
        scriptUrl: '/elements/demo-individual-wizard/main.js',
        tagName: 'a22-individual-wizard-element',
      },
    },
    'business-wizard': {
      enabled: true,
      standaloneUrl: 'http://localhost:4202/',
      element: {
        scriptUrl: '/elements/demo-business-wizard/main.js',
        tagName: 'a22-business-wizard-element',
      },
    },
  },
};

/** Deep-merges a partial `config.json` payload over the defaults. */
export function mergeAppConfig(raw: unknown): AppConfig {
  if (raw === null || typeof raw !== 'object') return DEFAULT_APP_CONFIG;
  const features = (raw as { features?: unknown }).features;
  if (features === null || typeof features !== 'object') return DEFAULT_APP_CONFIG;

  const merged: Record<string, FeatureConfig> = { ...DEFAULT_APP_CONFIG.features };
  for (const [id, value] of Object.entries(features as Record<string, unknown>)) {
    const base = merged[id] ?? { enabled: false, standaloneUrl: '' };
    if (value === null || typeof value !== 'object') continue;
    const partial = value as Partial<FeatureConfig>;
    merged[id] = {
      enabled: partial.enabled ?? base.enabled,
      standaloneUrl: partial.standaloneUrl ?? base.standaloneUrl,
      element: partial.element ?? base.element,
    };
  }
  return { features: merged as Record<FeatureId, FeatureConfig> };
}
