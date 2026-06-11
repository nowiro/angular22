import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import { ADDRESS_PURPOSES, BusinessWizardStore, PHONE_KINDS } from '@angular22/business-wizard-data';
import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22ButtonComponent, A22FieldErrorComponent, A22TextFieldComponent } from '@angular22/ui-material';
import type { AddressValue, PhoneValue } from '@angular22/wizard-core';
import { A22AddressFormComponent, A22PhoneRowComponent } from '@angular22/wizard-ui';

/** Step 2 — company e-mail, phones (with extension) and addresses. */
@Component({
  selector: 'a22-step-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    A22TranslatePipe,
    A22AddressFormComponent,
    A22ButtonComponent,
    A22FieldErrorComponent,
    A22PhoneRowComponent,
    A22TextFieldComponent,
    FormField,
  ],
  templateUrl: './step-contact.component.html',
  styleUrl: './step-contact.component.scss',
})
export class StepContactComponent {
  protected readonly store = inject(BusinessWizardStore);

  protected readonly form = this.store.form;
  protected readonly data = this.store.data;
  protected readonly phoneKinds = PHONE_KINDS;
  protected readonly addressPurposes = ADDRESS_PURPOSES;

  /** Array-level errors (e.g. missing headquarters address) — shown once touched. */
  protected readonly addressListErrors = computed(() => {
    const addresses = this.form.contact.addresses();
    return addresses.touched() && addresses.invalid() ? addresses.errors() : [];
  });

  protected phoneField(index: number): FieldTree<PhoneValue> {
    return this.form.contact.phones[index];
  }

  protected addressField(index: number): FieldTree<AddressValue> {
    return this.form.contact.addresses[index];
  }
}
