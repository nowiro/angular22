import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import type { RepresentativeValue } from '@angular22/business-wizard-data';
import { BusinessWizardStore, REPRESENTATIVE_ROLES } from '@angular22/business-wizard-data';
import {
  A22ButtonComponent,
  A22CheckboxComponent,
  A22SelectComponent,
  A22TextFieldComponent,
} from '@angular22/ui-material';

/** Step 4 — company representatives (array of contact persons). */
@Component({
  selector: 'a22-step-representatives',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22ButtonComponent, A22CheckboxComponent, A22SelectComponent, A22TextFieldComponent, FormField],
  templateUrl: './step-representatives.component.html',
  styleUrl: './step-representatives.component.scss',
})
export class StepRepresentativesComponent {
  protected readonly store = inject(BusinessWizardStore);

  protected readonly form = this.store.form;
  protected readonly data = this.store.data;
  protected readonly roles = REPRESENTATIVE_ROLES;

  protected representativeField(index: number): FieldTree<RepresentativeValue> {
    return this.form.representatives.items[index];
  }
}
