// @ts-check
import eslint from '@eslint/js';
import nx from '@nx/eslint-plugin';
import angular from 'angular-eslint';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
    },
  },

  // ─── Prettier compat (must be last) ─────────────────────────────
  prettier,
);
