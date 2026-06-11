import { computed, effect, Injectable, signal } from '@angular/core';
import { form } from '@angular/forms/signals';

import type { FillMode, WizardFillPresets } from '@angular22/wizard-core';
import { emptyAddress, emptyLanguage, emptyPhone } from '@angular22/wizard-core';
import { parsePesel } from '@angular22/wizard-validators';

import { applicableConsents } from './consents-catalog';
import { buildIndividualPreset } from './fill-preset';
import { individualWizardSchema } from './form-schema';
import type { IndividualData } from './models';
import { emptyContract, initialIndividualData } from './models';
import { relevanceOf } from './relevance';

/**
 * Root-scoped store of the individual wizard — owns the model signal and the
 * Signal Forms field tree built from it. The dashboard, the stepper, the
 * summary and the dev-fill panel all share this single instance.
 */
@Injectable({ providedIn: 'root' })
export class IndividualWizardStore implements WizardFillPresets {
  private readonly model = signal<IndividualData>(initialIndividualData());

  /** Signal Forms field tree — bind leaves with `[formField]`. */
  readonly form = form(this.model, individualWizardSchema);

  /** Read-only model snapshot. */
  readonly data = this.model.asReadonly();

  /** Conditional-branch visibility — the same predicates the schema uses. */
  readonly relevance = computed(() => relevanceOf(this.model()));

  readonly submitted = signal(false);

  constructor() {
    // A valid PESEL determines birth date and gender — keep them in sync.
    // The schema additionally disables both fields while the PESEL is valid.
    effect(() => {
      const info = parsePesel(this.model().basicData.pesel);
      if (info === null) return;
      const basic = this.model().basicData;
      const sameDate = basic.dateOfBirth !== null && basic.dateOfBirth.getTime() === info.birthDate.getTime();
      if (sameDate && basic.gender === info.gender) return;
      this.model.update((m) => ({
        ...m,
        basicData: { ...m.basicData, dateOfBirth: info.birthDate, gender: info.gender },
      }));
    });

    // Rebuild the consent list whenever the applicability context changes,
    // preserving granted flags by key. The equality guard stops the loop.
    effect(() => {
      const next = applicableConsents(this.model());
      const current = this.model().consents.items;
      const same =
        next.length === current.length &&
        next.every((item, i) => item.key === current[i]?.key && item.granted === current[i]?.granted);
      if (same) return;
      this.model.update((m) => ({ ...m, consents: { items: next } }));
    });
  }

  // ── Array helpers (immutable model updates) ───────────────────────────

  addPhone(): void {
    this.model.update((m) => ({
      ...m,
      contact: { ...m.contact, phones: [...m.contact.phones, emptyPhone('mobile')] },
    }));
  }

  removePhone(index: number): void {
    this.model.update((m) =>
      m.contact.phones.length > 1
        ? { ...m, contact: { ...m.contact, phones: m.contact.phones.filter((_, i) => i !== index) } }
        : m,
    );
  }

  addAddress(purpose = 'mailing'): void {
    this.model.update((m) => ({
      ...m,
      contact: { ...m.contact, addresses: [...m.contact.addresses, emptyAddress(purpose)] },
    }));
  }

  removeAddress(index: number): void {
    this.model.update((m) =>
      m.contact.addresses.length > 1
        ? { ...m, contact: { ...m.contact, addresses: m.contact.addresses.filter((_, i) => i !== index) } }
        : m,
    );
  }

  addLanguage(): void {
    this.model.update((m) => ({
      ...m,
      survey: { ...m.survey, languages: [...m.survey.languages, emptyLanguage()] },
    }));
  }

  removeLanguage(index: number): void {
    this.model.update((m) =>
      m.survey.languages.length > 1
        ? { ...m, survey: { ...m.survey, languages: m.survey.languages.filter((_, i) => i !== index) } }
        : m,
    );
  }

  addContract(): void {
    this.model.update((m) => ({
      ...m,
      survey: {
        ...m.survey,
        employment: {
          ...m.survey.employment,
          details: {
            ...m.survey.employment.details,
            contracts: [...m.survey.employment.details.contracts, emptyContract()],
          },
        },
      },
    }));
  }

  removeContract(index: number): void {
    this.model.update((m) =>
      m.survey.employment.details.contracts.length > 1
        ? {
            ...m,
            survey: {
              ...m.survey,
              employment: {
                ...m.survey.employment,
                details: {
                  ...m.survey.employment.details,
                  contracts: m.survey.employment.details.contracts.filter((_, i) => i !== index),
                },
              },
            },
          }
        : m,
    );
  }

  addKeyword(): void {
    this.model.update((m) => {
      const thesis = m.survey.higherEducation.specialisation.thesis;
      if (thesis.keywords.length >= 10) return m;
      return {
        ...m,
        survey: {
          ...m.survey,
          higherEducation: {
            ...m.survey.higherEducation,
            specialisation: {
              ...m.survey.higherEducation.specialisation,
              thesis: { ...thesis, keywords: [...thesis.keywords, ''] },
            },
          },
        },
      };
    });
  }

  removeKeyword(index: number): void {
    this.model.update((m) => {
      const thesis = m.survey.higherEducation.specialisation.thesis;
      if (thesis.keywords.length <= 1) return m;
      return {
        ...m,
        survey: {
          ...m.survey,
          higherEducation: {
            ...m.survey.higherEducation,
            specialisation: {
              ...m.survey.higherEducation.specialisation,
              thesis: { ...thesis, keywords: thesis.keywords.filter((_, i) => i !== index) },
            },
          },
        },
      };
    });
  }

  // ── Dev-fill presets (WIZARD_FILL_PRESETS) ────────────────────────────

  fill(mode: FillMode): void {
    this.model.set(buildIndividualPreset(mode));
    this.form().markAsTouched();
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────

  /** Validates the whole form; on success stamps `submittedAt`. */
  submit(): boolean {
    const root = this.form();
    if (!root.valid()) {
      root.markAsTouched();
      return false;
    }
    this.model.update((m) => ({ ...m, meta: { ...m.meta, submittedAt: new Date() } }));
    this.submitted.set(true);
    return true;
  }

  reset(): void {
    this.form().reset(initialIndividualData());
    this.submitted.set(false);
  }
}
