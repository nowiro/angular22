/**
 * Vitest setup - loads the Angular JIT compiler so partial-compiled Angular
 * packages (pulled in via the wizard-core barrel) can resolve their factories.
 */
import '@angular/compiler';
