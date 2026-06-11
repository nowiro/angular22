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
import { A22TranslatePipe, I18nStore } from '@angular22/shared-i18n';
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
  imports: [
    A22TranslatePipe,
    A22ButtonComponent,
    A22CheckboxComponent,
    A22DividerComponent,
    A22SummaryRowComponent,
    DatePipe,
    FormField,
  ],
  templateUrl: './step-summary.component.html',
  styleUrl: './step-summary.component.scss',
})
export class StepSummaryComponent {
  private readonly notifications = inject(A22NotificationService);
  private readonly i18n = inject(I18nStore);
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

  protected readonly genderLabel = computed(() => this.i18n.t(optionLabel(GENDERS, this.data().basicData.gender)));
  protected readonly citizenshipLabel = computed(() =>
    this.i18n.t(optionLabel(COUNTRIES, this.data().basicData.citizenship)),
  );

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
      return `${line}, ${address.postalCode} ${address.city} (${this.i18n.t(optionLabel(COUNTRIES, address.country))})`;
    }),
  );

  protected readonly educationSummary = computed(() => {
    const survey = this.data().survey;
    const parts = [this.i18n.t(optionLabel(EDUCATION_LEVELS, survey.educationLevel))];
    if (this.relevance().higherEducation && survey.higherEducation.university !== '') {
      parts.push(survey.higherEducation.university);
    }
    return parts.join(' — ');
  });

  protected readonly employmentSummary = computed(() => {
    const employment = this.data().survey.employment;
    const parts = [this.i18n.t(optionLabel(EMPLOYMENT_STATUSES, employment.status))];
    if (this.relevance().employmentDetails && employment.details.companyName !== '') {
      parts.push(`${employment.details.companyName} (${employment.details.position})`);
      const contracts = employment.details.contracts
        .map((contract) => this.i18n.t(optionLabel(CONTRACT_TYPES, contract.type)))
        .join(', ');
      if (contracts !== '') parts.push(contracts);
    }
    return parts.join(' — ');
  });

  protected readonly languagesSummary = computed(() =>
    this.data()
      .survey.languages.map(
        (language) => `${this.i18n.t(optionLabel(LANGUAGE_CODES, language.code))} (${language.level})`,
      )
      .join(', '),
  );

  protected submit(): void {
    if (this.store.submit()) {
      this.notifications.show(this.i18n.t('Wniosek został zapisany.'));
    } else {
      this.notifications.show(this.i18n.t('Formularz zawiera błędy — uzupełnij brakujące pola.'));
    }
  }
}
