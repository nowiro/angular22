import type { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

/**
 * Fallback messages for built-in Signal Forms validators that were registered
 * without an explicit `message`. Schemas in this workspace should always pass
 * messages — this map is the safety net.
 */
const FALLBACK_BY_KIND: Record<string, string> = {
  required: 'To pole jest wymagane.',
  email: 'Nieprawidłowy adres e-mail.',
  pattern: 'Nieprawidłowy format.',
  minLength: 'Wartość jest zbyt krótka.',
  maxLength: 'Wartość jest zbyt długa.',
  min: 'Wartość jest zbyt mała.',
  max: 'Wartość jest zbyt duża.',
};

/** Resolves the first error of a field to a human-readable message. */
export function errorMessage(errors: readonly WithOptionalFieldTree<ValidationError>[]): string {
  if (errors.length === 0) return '';
  const first = errors[0];
  return first.message ?? FALLBACK_BY_KIND[first.kind] ?? 'Pole jest nieprawidłowe.';
}
