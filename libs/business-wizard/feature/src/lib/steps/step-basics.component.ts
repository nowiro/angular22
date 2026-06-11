import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import { BusinessWizardStore, LEGAL_FORMS } from '@angular22/business-wizard-data';
import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22NumberFieldComponent, A22SelectComponent, A22TextFieldComponent } from '@angular22/ui-material';

/** Step 1 — legal identity: names, legal form, NIP/REGON/KRS, founding year. */
@Component({
  selector: 'a22-step-basics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22TranslatePipe, A22NumberFieldComponent, A22SelectComponent, A22TextFieldComponent, FormField],
  templateUrl: './step-basics.component.html',
  styleUrl: './step-basics.component.scss',
})
export class StepBasicsComponent {
  protected readonly store = inject(BusinessWizardStore);

  protected readonly form = this.store.form;
  protected readonly krsRequired = this.store.krsRequired;
  protected readonly legalForms = LEGAL_FORMS;
}
