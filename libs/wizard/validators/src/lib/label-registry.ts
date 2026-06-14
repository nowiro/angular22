/**
 * Central `{key → label}` dictionary for validation errors. Every validator
 * carries a `kind` (the key); the registry maps it to a human label (Polish
 * source string — `a22T` translates it to EN at render time). Custom validators
 * register their own `{key, label}` via {@link defineValidator}, so a project
 * can add domain rules without touching the wrapper or i18n layers.
 */

/** One dictionary entry: a stable validator key and its Polish label. */
export interface ValidationLabel {
  readonly key: string;
  readonly label: string;
}

/** Standard Signal-Forms error shape. */
type ErrorResult = { readonly kind: string; readonly message: string } | null;

const REGISTRY = new Map<string, string>();

/** Register (or override) the label for a validator key. Returns the key. */
export function registerValidationLabel(entry: ValidationLabel): string {
  REGISTRY.set(entry.key, entry.label);
  return entry.key;
}

/** Register many entries at once (e.g. a custom validator pack). */
export function registerValidationLabels(entries: readonly ValidationLabel[]): void {
  for (const entry of entries) REGISTRY.set(entry.key, entry.label);
}

/** Resolve a key to its registered label, or `undefined` when unknown. */
export function validationLabel(key: string): string | undefined {
  return REGISTRY.get(key);
}

/** Snapshot of the whole dictionary (debugging / docs). */
export function validationLabels(): readonly ValidationLabel[] {
  return [...REGISTRY].map(([key, label]) => ({ key, label }));
}

/**
 * Builds a Signal-Forms-friendly error factory from a `{key, label}` dictionary
 * entry plus a predicate. Registers the label, then returns a function that
 * yields `{ kind, message }` (or `null` when valid) — drop it straight into a
 * schema `validate()`:
 *
 * ```ts
 * const evenError = defineValidator({ key: 'even', label: 'Liczba musi być parzysta.' }, (n: number) => n % 2 === 0);
 * validate(path.amount, ({ value }) => evenError(value()));
 * ```
 *
 * The label lives in the dictionary, so it is reusable (`validationLabel('even')`)
 * and overridable (`registerValidationLabel`) without editing the validator.
 */
export function defineValidator<T = string>(
  entry: ValidationLabel,
  isValid: (value: T) => boolean,
): (value: T) => ErrorResult {
  registerValidationLabel(entry);
  return (value) => (isValid(value) ? null : { kind: entry.key, message: entry.label });
}
