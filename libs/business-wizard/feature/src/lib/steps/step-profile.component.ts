import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import {
  BusinessWizardStore,
  CUSTOMER_SEGMENTS,
  EMPLOYEE_RANGES,
  FISCAL_YEAR_ENDS,
  INDUSTRIES,
  REVENUE_RANGES,
} from '@angular22/business-wizard-data';
import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22ButtonComponent, A22CheckboxComponent, A22SelectComponent } from '@angular22/ui-material';
import type { LanguageValue } from '@angular22/wizard-core';
import { A22LanguageRowComponent } from '@angular22/wizard-ui';

/** Step 3 — classification & scale; drives the consent catalog. */
@Component({
  selector: 'a22-step-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    A22TranslatePipe,
    A22ButtonComponent,
    A22CheckboxComponent,
    A22LanguageRowComponent,
    A22SelectComponent,
    FormField,
  ],
  templateUrl: './step-profile.component.html',
  styleUrl: './step-profile.component.scss',
})
export class StepProfileComponent {
  protected readonly store = inject(BusinessWizardStore);

  protected readonly form = this.store.form;
  protected readonly data = this.store.data;

  protected readonly industries = INDUSTRIES;
  protected readonly customerSegments = CUSTOMER_SEGMENTS;
  protected readonly revenueRanges = REVENUE_RANGES;
  protected readonly employeeRanges = EMPLOYEE_RANGES;
  protected readonly fiscalYearEnds = FISCAL_YEAR_ENDS;

  protected languageField(index: number): FieldTree<LanguageValue> {
    return this.form.profile.workingLanguages[index];
  }
}
