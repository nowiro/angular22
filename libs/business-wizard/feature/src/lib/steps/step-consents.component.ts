import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';

import { BusinessWizardStore } from '@angular22/business-wizard-data';
import type { ConsentItemValue } from '@angular22/wizard-core';
import { A22ConsentRowComponent } from '@angular22/wizard-ui';

/** Step 5 — profile-driven consent list (rebuilt reactively by the store). */
@Component({
  selector: 'a22-step-consents',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22ConsentRowComponent],
  templateUrl: './step-consents.component.html',
  styleUrl: './step-consents.component.scss',
})
export class StepConsentsComponent {
  protected readonly store = inject(BusinessWizardStore);

  protected readonly form = this.store.form;
  protected readonly data = this.store.data;

  protected consentField(index: number): FieldTree<ConsentItemValue> {
    return this.form.consents.items[index];
  }
}
