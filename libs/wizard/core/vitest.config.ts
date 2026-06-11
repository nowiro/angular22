/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // Mirror of the tsconfig.base.json path mapping (plain vitest does not
      // read TS path aliases).
      '@angular22/wizard-validators': resolve(import.meta.dirname, '../validators/src/index.ts'),
    },
  },
  test: {
    globals: true,
    setupFiles: ['./test-setup.ts'],
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      reportsDirectory: '../../../coverage/libs/wizard/core',
    },
  },
});
