// @ts-check
import eslint from '@eslint/js';
import nx from '@nx/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import angular from 'angular-eslint';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import nodePlugin from 'eslint-plugin-n';
import noBarrel from 'eslint-plugin-no-barrel-files';
import rxjsAngular from 'eslint-plugin-rxjs-angular-x';
import rxjs from 'eslint-plugin-rxjs-x';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { createRequire } from 'node:module';
import tseslint from 'typescript-eslint';

const requirePkg = createRequire(import.meta.url);

/**
 * Signal Forms requirement gate (version-aware).
 *
 * Angular 22 promotes Signal Forms (`@angular/forms/signals`) to THE forms model.
 * From major 22 on, the classic reactive/template API (`FormGroup`, `FormBuilder`,
 * `ngModel`, …, all re-exported from the bare `@angular/forms` entry point) is a
 * lint error, so the codebase can only grow Signal Forms. On earlier Angular
 * majors the classic API stays supported — the same config lints a pre-22 checkout
 * mid-migration without false errors.
 *
 * The Angular major is read from the workspace `package.json` — the canonical
 * version source (docs/tech-stack.md). Bumping `@angular/core` to 22.x flips it on.
 */
const angularMajor = (() => {
  // Prefer the actually-installed @angular/core version; fall back to the version
  // declared in the workspace package.json (the canonical source — docs/tech-stack.md).
  // Both reads are fail-safe: any throw / odd specifier (npm-alias, workspace:*, range)
  // yields 0 → gate OFF, so a pre-22 checkout never produces false lint errors.
  const sources = [
    () => requirePkg('@angular/core/package.json').version,
    () => requirePkg('./package.json').dependencies?.['@angular/core'],
  ];
  for (const read of sources) {
    try {
      const major = Number.parseInt(String(read() ?? '').replace(/^\D+/, ''), 10);
      if (major) return major;
    } catch {
      // unresolved source — try the next one
    }
  }
  return 0;
})();
const enforceSignalForms = angularMajor >= 22;
const signalFormsBanMessage =
  'Signal Forms are required on Angular >= 22: import from "@angular/forms/signals" ' +
  '(form()/schema()/[formField]; field wrappers implement FormValueControl/FormCheckboxControl). ' +
  'The classic "@angular/forms" API and its "@angular/forms/signals/compat" bridge ' +
  '(FormGroup/FormBuilder/FormControl/AbstractControl/ReactiveFormsModule/FormsModule/ngModel) ' +
  'are banned — see docs/tech-stack.md and .github/instructions/angular.instructions.md.';
// Match the bare "@angular/forms" entry point AND the classic-compat bridge
// "@angular/forms/signals/compat"; the pure "@angular/forms/signals" surface is
// deliberately NOT matched. Covers static import, re-export, dynamic import() and
// TS `import x = require(...)` so the gate can't be laundered through a non-static form.
const bannedFormsSource = String.raw`/^@angular\/forms(\/signals\/compat)?$/`;
const signalFormsBanSelectors = [
  `ImportDeclaration[source.value=${bannedFormsSource}]`,
  `ImportExpression[source.value=${bannedFormsSource}]`,
  `ExportNamedDeclaration[source.value=${bannedFormsSource}]`,
  `ExportAllDeclaration[source.value=${bannedFormsSource}]`,
  `TSImportEqualsDeclaration > TSExternalModuleReference > Literal[value=${bannedFormsSource}]`,
].map((selector) => ({ selector, message: signalFormsBanMessage }));

/**
 * angular22 — ESLint flat config
 *
 * Enforces Angular 22 conventions: standalone + OnPush + signals + native
 * control flow, Nx module boundaries, and the Material wrapper gate (apps and
 * libs consume `@angular22/ui-material` wrappers, never raw `@angular/material`).
 */
export default tseslint.config(
  // ─── Ignore patterns ────────────────────────────────────────────
  {
    ignores: [
      '**/dist',
      '**/coverage',
      '**/.angular',
      '**/.nx',
      '**/node_modules',
      '**/test-results',
      '**/playwright-report',
      '**/*.config.js',
      '**/*.config.cjs',
    ],
  },

  // ─── TypeScript files ───────────────────────────────────────────
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // typescript-eslint Project Service — lazily resolves the nearest
        // tsconfig per file (memory-efficient type-aware lint).
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
    },
    extends: [
      eslint.configs.recommended,
      ...nx.configs['flat/base'],
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      ...nx.configs['flat/angular'],
      ...nx.configs['flat/typescript'],
      sonarjs.configs.recommended,
      jsdoc.configs['flat/recommended-typescript'],
    ],
    plugins: {
      import: importPlugin,
      unicorn,
      'rxjs-x': rxjs,
      'rxjs-angular-x': rxjsAngular,
    },
    processor: angular.processInlineTemplates,
    rules: {
      // ── Angular conventions ──
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'a22', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'a22', style: 'camelCase' }],
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',

      // ── Modern Angular patterns (signals, inject) ──
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-inject': 'error',

      // ── TypeScript safety ──
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // ── Import hygiene ──
      'import/no-default-export': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/order': 'off', // delegated to Prettier import-sort plugin

      // ── Unicorn (modern JS guardrails) ──
      'unicorn/filename-case': ['error', { cases: { kebabCase: true } }],
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-reduce': 'off',

      // ── SonarJS (cognitive complexity) ──
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': ['error', { threshold: 5 }],

      // ── JSDoc (TypeScript types already document params/returns) ──
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/tag-lines': 'off',
      'jsdoc/check-tag-names': ['warn', { definedTags: ['packageDocumentation'] }],

      // ── RxJS safety (rxjs-x) ──
      'rxjs-x/no-async-subscribe': 'error',
      'rxjs-x/no-floating-observables': 'error',
      'rxjs-x/no-nested-subscribe': 'error',
      'rxjs-x/no-unbound-methods': 'error',
      'rxjs-x/throw-error': 'error',

      // ── RxJS + Angular (rxjs-angular-x) ──
      // prefer-takeuntil with DestroyRef alias — prevents subscription leaks in components
      'rxjs-angular-x/prefer-takeuntil': [
        'warn',
        {
          alias: ['takeUntilDestroyed'],
        },
      ],

      // ── No console ──
      'no-console': 'error',

      // ── Nx module boundaries ──
      //
      //   scope:shared              → ui/material, wizard/* — usable from anywhere
      //   scope:individual-wizard   → individual-wizard app + its libs
      //   scope:business-wizard     → business-wizard app + its libs
      //   scope:landing             → the angular22 landing app
      //
      // type:* enforces layering: app → feature → ui/data-access → util.
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: 'scope:portal',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              // `base` = the starter/template app (apps/base). Like the host app it
              // only consumes shared libs; a copy retags scope:base -> scope:<app>.
              sourceTag: 'scope:base',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:base'],
            },
            {
              sourceTag: 'scope:individual-wizard',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:individual-wizard'],
            },
            {
              sourceTag: 'scope:business-wizard',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:business-wizard'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['type:util'],
            },
          ],
        },
      ],
    },
  },

  // ─── Material wrapper gate ──────────────────────────────────────
  // Every Angular Material / CDK consumer goes through @angular22/ui-material
  // wrappers. libs/ui/material is the ONE place allowed to import the raw
  // framework — everything else gets a lint error with a pointer.
  {
    files: ['libs/**/*.ts', 'apps/**/*.ts'],
    ignores: ['libs/ui/material/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@angular/material', '@angular/material/*', '@angular/cdk', '@angular/cdk/*'],
              message:
                'Direct @angular/material / @angular/cdk imports are forbidden outside libs/ui/material. Import the wrapper from @angular22/ui-material instead.',
            },
          ],
        },
      ],
    },
  },

  // ─── Signal Forms gate (Angular >= 22) ──────────────────────────
  // Angular 22 makes Signal Forms (@angular/forms/signals) the required forms
  // model. The classic reactive/template API — FormGroup, FormBuilder, FormControl,
  // ReactiveFormsModule, FormsModule, ngModel, … reachable via the bare
  // "@angular/forms" entry point or the "@angular/forms/signals/compat" bridge — is
  // banned here across static import, re-export, dynamic import() and import=require.
  // The pure "@angular/forms/signals" subpath is a DIFFERENT specifier and stays
  // allowed, so the Material wrappers (FormValueControl/FormCheckboxControl) keep
  // working. Template-driven ngModel is blocked transitively: it needs FormsModule,
  // whose import is forbidden. On Angular < 22 this block is omitted → classic forms
  // remain fully supported for a pre-migration checkout. Enforced via `nx lint`
  // (pnpm lint), the pre-commit/CI path; a bare root `eslint` run resolves a
  // different base path and is not the gate.
  ...(enforceSignalForms
    ? [
        {
          files: ['libs/**/*.ts', 'apps/**/*.ts'],
          rules: {
            'no-restricted-syntax': ['error', ...signalFormsBanSelectors],
          },
        },
      ]
    : []),

  // ─── Angular HTML templates ─────────────────────────────────────
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
      // Calling expressions in templates is the Angular signals idiom: {{ value() }}
      '@angular-eslint/template/no-call-expression': 'off',
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
    },
  },

  // ─── Barrel files (Nx build performance) ────────────────────
  // Blocks internal barrel files inside libs — they cause build graph
  // explosion and slow down HMR / test runs in an Nx monorepo.
  // Root index.ts of each lib is the intentional public API — allowed.
  {
    files: ['libs/**/src/**/*.ts'],
    ignores: [
      'libs/*/src/index.ts', // public lib API boundary — allowed
      'libs/*/*/src/index.ts', // nested lib public API — allowed
    ],
    plugins: { 'no-barrel-files': noBarrel },
    rules: {
      'no-barrel-files/no-barrel-files': 'error',
    },
  },

  // ─── Vitest rules (unit test files only) ─────────────────────
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    plugins: { vitest },
    rules: {
      'vitest/no-focused-tests': 'error', // blocks committed test.only
      'vitest/no-disabled-tests': 'warn', // flags forgotten test.skip
      'vitest/expect-expect': 'error', // every test must have assertion
      'vitest/no-identical-title': 'error', // no duplicate describe/it names
      'vitest/valid-expect': 'error', // correct expect() API usage
      'vitest/consistent-test-it': ['warn', { fn: 'it' }], // prefer it() over test()
    },
  },

  // ─── Test / spec / e2e files (relaxed rules, still type-aware) ──
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/test-setup.ts', '**/e2e/**/*.ts', 'apps/*-e2e/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/assertions-in-tests': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'no-console': 'off',
    },
  },

  // ─── Tooling / config files (outside any project tsconfig) ──────
  {
    files: [
      '**/*.config.{ts,mts,cts,mjs,js,cjs}',
      '**/vitest.config.*',
      '**/playwright.config.*',
      '**/eslint.config.*',
      '**/test-setup.ts',
    ],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      parserOptions: { projectService: false, project: null },
    },
    rules: {
      'import/no-default-export': 'off',
      // rxjs-x and rxjs-angular-x rules require type information — disable for non-typed files
      'rxjs-x/no-async-subscribe': 'off',
      'rxjs-x/no-floating-observables': 'off',
      'rxjs-x/no-nested-subscribe': 'off',
      'rxjs-x/no-unbound-methods': 'off',
      'rxjs-x/throw-error': 'off',
      'rxjs-angular-x/prefer-takeuntil': 'off',
    },
  },

  // ─── Node.js rules (tooling scripts only) ────────────────────
  {
    files: ['tools/**/*.{ts,mjs,js,cjs}', '**/vitest.config.*', '**/playwright.config.*', 'eslint.config.mjs'],
    plugins: { n: nodePlugin },
    rules: {
      'n/no-missing-import': 'error', // catches missing deps in scripts
      'n/no-unpublished-import': 'warn', // flags test-only packages in tooling
      // n/prefer-node-protocol: OFF — duplicate of unicorn/prefer-node-protocol
    },
  },

  // ─── Prettier compat (must be last) ─────────────────────────────
  prettier,
);
