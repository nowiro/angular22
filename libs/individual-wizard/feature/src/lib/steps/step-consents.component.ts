import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';

import { consentDescription, IndividualWizardStore } from '@angular22/individual-wizard-data';
import { A22TranslatePipe } from '@angular22/shared-i18n';
import type { ConsentItemValue } from '@angular22/wizard-core';
import { A22ConsentRowComponent } from '@angular22/wizard-ui';

/** Step 4 — context-driven consent list (rebuilt reactively by the store). */
@Component({
  selector: 'a22-step-consents',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22TranslatePipe, A22ConsentRowComponent],
  templateUrl: './step-consents.component.html',
  styleUrl: './step-consents.component.scss',
})
export class StepConsentsComponent {
  protected readonly store = inject(IndividualWizardStore);

  protected readonly form = this.store.form;
  protected readonly data = this.store.data;

  protected consentField(index: number): FieldTree<ConsentItemValue> {
    return this.form.consents.items[index];
  }

  protected descriptionOf(key: string): string {
    return consentDescription(key);
  }
}
