/**
 * Vitest setup — loads the Angular JIT compiler so any partial-compiled Angular
 * package pulled in transitively can resolve its factories. The logic specs in
 * this lib import their target modules directly (not the barrel), so this is a
 * safety net rather than a hard requirement.
 */
import '@angular/compiler';
