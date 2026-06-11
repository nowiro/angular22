import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22SelectComponent, A22TextFieldComponent } from '@angular22/ui-material';
import type { AddressValue, Option } from '@angular22/wizard-core';
import { COUNTRIES, STREET_TYPES } from '@angular22/wizard-core';

/**
 * One address sub-form bound to a `FieldTree<AddressValue>`. The purpose
 * dictionary is wizard-specific (residence/mailing vs headquarters/branch),
 * so it comes in as an input; street types and countries are shared.
 */
@Component({
  selector: 'a22-address-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22TranslatePipe, A22SelectComponent, A22TextFieldComponent, FormField],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class A22AddressFormComponent {
  readonly field = input.required<FieldTree<AddressValue>>();
  readonly purposeOptions = input.required<readonly Option<string>[]>();

  protected readonly streetTypes = STREET_TYPES;
  protected readonly countries = COUNTRIES;
}
