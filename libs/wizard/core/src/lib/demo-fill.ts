/**
 * Dev-fill helpers shared by both wizards' demo presets. The "fill the form"
 * logic that is identical across wizards (a populated address row, the consent
 * projection) lives here so each app's preset only carries its own specifics.
 */
import type { FillMode } from './fill-presets';
import { randomCity, randomFlatNumber, randomHouseNumber, randomPostalCode, randomStreet } from './polish-fake-data';
import { emptyAddress } from './shared-models';
import type { AddressValue, ConsentItemValue } from './shared-models';

/** A fully-populated address row for the given purpose (demo data). */
export function filledAddress(purpose: string): AddressValue {
  return {
    ...emptyAddress(purpose),
    street: randomStreet(),
    houseNumber: randomHouseNumber(),
    flatNumber: randomFlatNumber(),
    postalCode: randomPostalCode(),
    city: randomCity(),
  };
}

/**
 * Projects the applicable consents for a fill mode: required consents are always
 * granted; the fuller modes (`all` / `max`) grant the optional ones too.
 */
export function grantConsents(items: readonly ConsentItemValue[], mode: FillMode): ConsentItemValue[] {
  return items.map((item) => ({ ...item, granted: mode === 'required' ? item.required : true }));
}
