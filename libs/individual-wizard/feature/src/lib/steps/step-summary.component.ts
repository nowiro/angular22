import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import {
  CONTRACT_TYPES,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
  GENDERS,
  IndividualWizardStore,
} from '@angular22/individual-wizard-data';
import {
  A22ButtonComponent,
  A22CheckboxComponent,
  A22DividerComponent,
  A22NotificationService,
} from '@angular22/ui-material';
import { COUNTRIES, LANGUAGE_CODES, optionLabel } from '@angular22/wizard-core';
import { A22SummaryRowComponent } from '@angular22/wizard-ui';

/** Step 5 — read-only recap, cross-step error banner, terms + submit. */
@Component({
  selector: 'a22-step-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22ButtonComponent, A22CheckboxComponent, A22DividerComponent, A22SummaryRowComponent, DatePipe, FormField],
  templateUrl: './step-summary.component.html',
  styleUrl: './step-summary.component.scss',
})
export class StepSummaryComponent {
  private readonly notifications = inject(A22NotificationService);
  protected readonly store = inject(IndividualWizardStore);

  protected readonly form = this.store.form;
  protected readonly data = this.store.data;
  protected readonly relevance = this.store.relevance;

  protected readonly rootValid = computed(() => this.form().valid());

  /** Unique blocker messages collected from the whole tree (shown after touch). */
  protected readonly blockers = computed(() => {
    const root = this.form();
    if (!root.touched() || root.valid()) return [] as string[];
    const messages = root.errorSummary().map((error) => error.message ?? error.kind);
    return [...new Set(messages)];
  });

  protected readonly fullName = computed(() => {
    const basic = this.data().basicData;
    return [basic.firstName, basic.middleName, basic.lastName].filter((part) => part !== '').join(' ');
  });

  protected readonly genderLabel = computed(() => optionLabel(GENDERS, this.data().basicData.gender));
  protected readonly citizenshipLabel = computed(() => optionLabel(COUNTRIES, this.data().basicData.citizenship));

  protected readonly phonesSummary = computed(() =>
    this.data()
      .contact.phones.map((phone) => phone.number)
      .filter((number) => number !== '')
      .join(', '),
  );

  protected readonly addressSummaries = computed(() =>
    this.data().contact.addresses.map((address) => {
      const flat = address.flatNumber !== '' ? `/${address.flatNumber}` : '';
      const line = `${address.streetType} ${address.street} ${address.houseNumber}${flat}`.trim();
      return `${line}, ${address.postalCode} ${address.city} (${optionLabel(COUNTRIES, address.country)})`;
    }),
  );

  protected readonly educationSummary = computed(() => {
    const survey = this.data().survey;
    const parts = [optionLabel(EDUCATION_LEVELS, survey.educationLevel)];
    if (this.relevance().higherEducation && survey.higherEducation.university !== '') {
      parts.push(survey.higherEducation.university);
    }
    return parts.join(' — ');
  });

  protected readonly employmentSummary = computed(() => {
    const employment = this.data().survey.employment;
    const parts = [optionLabel(EMPLOYMENT_STATUSES, employment.status)];
    if (this.relevance().employmentDetails && employment.details.companyName !== '') {
      parts.push(`${employment.details.companyName} (${employment.details.position})`);
      const contracts = employment.details.contracts
        .map((contract) => optionLabel(CONTRACT_TYPES, contract.type))
        .join(', ');
      if (contracts !== '') parts.push(contracts);
    }
    return parts.join(' — ');
  });

  protected readonly languagesSummary = computed(() =>
    this.data()
      .survey.languages.map((language) => `${optionLabel(LANGUAGE_CODES, language.code)} (${language.level})`)
      .join(', '),
  );

  protected submit(): void {
    if (this.store.submit()) {
      this.notifications.show('Wniosek został zapisany.');
    } else {
      this.notifications.show('Formularz zawiera błędy — uzupełnij brakujące pola.');
    }
  }
}
