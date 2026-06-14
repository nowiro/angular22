/* eslint-disable @typescript-eslint/unbound-method --
 * Destructuring `value` / `valueOf` from the Signal Forms `FieldContext` is the
 * documented schema idiom (they are context accessors, not `this`-bound
 * methods). The rule cannot tell and misfires on every validator below.
 */
/**
 * Final, cross-cutting validators shared by EVERY wizard form, applied at the
 * schema root. Centralises the rules both wizard schemas previously duplicated:
 *
 * - **group/object level** — the form-wide "terms accepted" check.
 * - **array level** — "every required consent is granted" and "an address of a
 *   given purpose is present" (the purpose depends on the app: residence for the
 *   individual wizard, headquarters for the business one).
 *
 * Kinds and messages are passed in, so each wizard keeps its own stable error
 * ids while sharing one implementation.
 */
import { applyEach, type SchemaPath, validate } from '@angular/forms/signals';

import type { AddressValue, ConsentItemValue } from './shared-models';

/** A validation outcome descriptor: the error `kind` and its Polish message. */
export interface FinalCheckError {
  readonly kind: string;
  readonly message: string;
}

/** Configuration for {@link applyFinalChecks}. */
export interface FinalChecksConfig {
  /** `meta.acceptTerms` boolean — object/group-level check. */
  readonly acceptTerms: { readonly path: SchemaPath<boolean> } & FinalCheckError;
  /** `consents.items` array — every required consent must be granted. */
  readonly consents: { readonly path: SchemaPath<ConsentItemValue[]> } & FinalCheckError;
  /** Address array + the purpose that must be present (array-level, app-specific). */
  readonly requiredAddress: {
    readonly path: SchemaPath<AddressValue[]>;
    readonly purpose: string;
  } & FinalCheckError;
}

/** Applies the shared final checks (terms · consents · required address purpose). */
export function applyFinalChecks(config: FinalChecksConfig): void {
  const { acceptTerms, consents, requiredAddress } = config;

  // Group-level: the regulamin must be accepted.
  validate(acceptTerms.path, ({ value }) =>
    value() ? null : { kind: acceptTerms.kind, message: acceptTerms.message },
  );

  // Array-level: every required consent must be granted.
  applyEach(consents.path, (item) => {
    validate(item.granted, ({ value, valueOf }) =>
      valueOf(item.required) && !value() ? { kind: consents.kind, message: consents.message } : null,
    );
  });

  // Array-level: at least one address with the app-required purpose.
  validate(requiredAddress.path, ({ value }) =>
    value().some((address) => address.purpose === requiredAddress.purpose)
      ? null
      : { kind: requiredAddress.kind, message: requiredAddress.message },
  );
}
