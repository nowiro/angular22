import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import type { ContractValue } from '@angular22/individual-wizard-data';
import {
  CONTRACT_TYPES,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
  IndividualWizardStore,
  IT_BRANCHES,
  STUDY_FIELDS,
} from '@angular22/individual-wizard-data';
import {
  A22ButtonComponent,
  A22DateFieldComponent,
  A22NumberFieldComponent,
  A22SelectComponent,
  A22TextFieldComponent,
} from '@angular22/ui-material';
import type { LanguageValue } from '@angular22/wizard-core';
import { A22LanguageRowComponent } from '@angular22/wizard-ui';

/**
 * Step 3 — the conditional survey: education (→ university → IT branch →
 * thesis), employment (→ details + contracts), languages. Branch visibility
 * comes from the store's `relevance` signal — the same predicates the schema
 * uses for validation gating.
 */
@Component({
  selector: 'a22-step-survey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    A22ButtonComponent,
    A22DateFieldComponent,
    A22LanguageRowComponent,
    A22NumberFieldComponent,
    A22SelectComponent,
    A22TextFieldComponent,
    FormField,
  ],
  templateUrl: './step-survey.component.html',
  styleUrl: './step-survey.component.scss',
})
export class StepSurveyComponent {
  protected readonly store = inject(IndividualWizardStore);

  protected readonly form = this.store.form;
  protected readonly data = this.store.data;
  protected readonly relevance = this.store.relevance;

  protected readonly educationLevels = EDUCATION_LEVELS;
  protected readonly studyFields = STUDY_FIELDS;
  protected readonly itBranches = IT_BRANCHES;
  protected readonly employmentStatuses = EMPLOYMENT_STATUSES;
  protected readonly contractTypes = CONTRACT_TYPES;

  protected keywordField(index: number): FieldTree<string> {
    return this.form.survey.higherEducation.specialisation.thesis.keywords[index];
  }

  protected contractField(index: number): FieldTree<ContractValue> {
    return this.form.survey.employment.details.contracts[index];
  }

  protected languageField(index: number): FieldTree<LanguageValue> {
    return this.form.survey.languages[index];
  }
}
