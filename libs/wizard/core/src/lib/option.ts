/**
 * Select-option shape shared by every dictionary in the workspace.
 *
 * `T` is a string-literal union so dictionaries keep their discriminating
 * literal types (`Option<CountryCode>[]` etc.).
 */
export interface Option<T extends string> {
  readonly value: T;
  readonly label: string;
}

/** Resolves the display label of a dictionary value (falls back to the raw value). */
export function optionLabel<T extends string>(options: readonly Option<T>[], value: T): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
