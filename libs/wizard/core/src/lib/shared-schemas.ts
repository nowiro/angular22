/**
 * Signal Forms sub-schemas shared by both wizards (address + phone rows).
 * Wizard-specific rules (e.g. "at least one residence/headquarters address")
 * stay in each wizard's own schema.
 */
import { maxLength, required, schema, validate } from '@angular/forms/signals';

import { plPhoneError, plPostalCodeError } from '@angular22/wizard-validators';

import type { AddressValue, PhoneValue } from './shared-models';

export const addressSchema = schema<AddressValue>((address) => {
  required(address.street, { message: 'Nazwa ulicy jest wymagana.' });
  maxLength(address.street, 100, { message: 'Maksymalnie 100 znaków.' });
  required(address.houseNumber, { message: 'Numer domu jest wymagany.' });
  maxLength(address.houseNumber, 10, { message: 'Maksymalnie 10 znaków.' });
  required(address.postalCode, { message: 'Kod pocztowy jest wymagany.' });
  validate(address.postalCode, ({ value }) => plPostalCodeError(value()));
  required(address.city, { message: 'Miasto jest wymagane.' });
  maxLength(address.city, 80, { message: 'Maksymalnie 80 znaków.' });
});

export const phoneSchema = schema<PhoneValue>((phone) => {
  required(phone.number, { message: 'Numer telefonu jest wymagany.' });
  validate(phone.number, ({ value }) => plPhoneError(value()));
});
