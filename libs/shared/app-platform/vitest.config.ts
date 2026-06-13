/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Pure provider-composition lib — no node-testable logic (the repo is
    // TestBed-free); correctness is covered by the apps building + e2e boot.
    passWithNoTests: true,
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      reportsDirectory: '../../../coverage/libs/shared/app-platform',
    },
  },
});
