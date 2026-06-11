import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import { GENDERS, IndividualWizardStore } from '@angular22/individual-wizard-data';
import { A22TranslatePipe } from '@angular22/shared-i18n';
import {
  A22DateFieldComponent,
  A22IconComponent,
  A22SelectComponent,
  A22TextFieldComponent,
} from '@angular22/ui-material';
import { COUNTRIES } from '@angular22/wizard-core';
import { parsePesel } from '@angular22/wizard-validators';

/** Step 1 — citizenship, names, PESEL/NIP, birth date, gender. */
@Component({
  selector: 'a22-step-basic-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    A22TranslatePipe,
    A22DateFieldComponent,
    A22IconComponent,
    A22SelectComponent,
    A22TextFieldComponent,
    FormField,
  ],
  templateUrl: './step-basic-data.component.html',
  styleUrl: './step-basic-data.component.scss',
})
export class StepBasicDataComponent {
  private readonly store = inject(IndividualWizardStore);

  protected readonly form = this.store.form;
  protected readonly countries = COUNTRIES;
  protected readonly genders = GENDERS;

  /** True when a checksum-valid PESEL drives (and locks) birth date + gender. */
  protected readonly peselLocked = computed(() => parsePesel(this.store.data().basicData.pesel) !== null);
}
