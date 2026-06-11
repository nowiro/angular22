import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import {
  BusinessWizardStore,
  CUSTOMER_SEGMENTS,
  EMPLOYEE_RANGES,
  INDUSTRIES,
  LEGAL_FORMS,
  REPRESENTATIVE_ROLES,
  REVENUE_RANGES,
} from '@angular22/business-wizard-data';
import {
  A22ButtonComponent,
  A22CheckboxComponent,
  A22DividerComponent,
  A22NotificationService,
} from '@angular22/ui-material';
import { COUNTRIES, LANGUAGE_CODES, optionLabel } from '@angular22/wizard-core';
import { A22SummaryRowComponent } from '@angular22/wizard-ui';

/** Step 6 — read-only recap, cross-step error banner, terms + submit. */
@Component({
  selector: 'a22-step-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22ButtonComponent, A22CheckboxComponent, A22DividerComponent, A22SummaryRowComponent, DatePipe, FormField],
  templateUrl: './step-summary.component.html',
  styleUrl: './step-summary.component.scss',
})
export class StepSummaryComponent {
  private readonly notifications = inject(A22NotificationService);
  protected readonly store = inject(BusinessWizardStore);

  protected readonly form = this.store.form;
  protected readonly data = this.store.data;

  protected readonly rootValid = computed(() => this.form().valid());

  /** Unique blocker messages collected from the whole tree (shown after touch). */
  protected readonly blockers = computed(() => {
    const root = this.form();
    if (!root.touched() || root.valid()) return [] as string[];
    const messages = root.errorSummary().map((error) => error.message ?? error.kind);
    return [...new Set(messages)];
  });

  protected readonly legalFormLabel = computed(() => optionLabel(LEGAL_FORMS, this.data().companyBasics.legalForm));
  protected readonly industryLabel = computed(() => optionLabel(INDUSTRIES, this.data().profile.industry));
  protected readonly segmentLabel = computed(() => optionLabel(CUSTOMER_SEGMENTS, this.data().profile.customerSegment));

  protected readonly foundingYear = computed(() => {
    const year = this.data().companyBasics.foundingYear;
    return year === null ? '' : String(year);
  });

  protected readonly scaleSummary = computed(() => {
    const profile = this.data().profile;
    return `${optionLabel(REVENUE_RANGES, profile.revenueRange)} · ${optionLabel(EMPLOYEE_RANGES, profile.employeeRange)}`;
  });

  protected readonly phonesSummary = computed(() =>
    this.data()
      .contact.phones.map((phone) => (phone.extension !== '' ? `${phone.number} w. ${phone.extension}` : phone.number))
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

  protected readonly languagesSummary = computed(() =>
    this.data()
      .profile.workingLanguages.map((language) => `${optionLabel(LANGUAGE_CODES, language.code)} (${language.level})`)
      .join(', '),
  );

  protected readonly representativeSummaries = computed(() =>
    this.data().representatives.items.map((rep) => {
      const sign = rep.authorisedToSign ? ', podpisuje umowy' : '';
      return `${rep.fullName} — ${optionLabel(REPRESENTATIVE_ROLES, rep.role)} (${rep.email}${sign})`;
    }),
  );

  protected submit(): void {
    if (this.store.submit()) {
      this.notifications.show('Wniosek został zapisany.');
    } else {
      this.notifications.show('Formularz zawiera błędy — uzupełnij brakujące pola.');
    }
  }
}
