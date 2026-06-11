import { computed, effect, Injectable, signal } from '@angular/core';
import { form } from '@angular/forms/signals';

import type { FillMode, WizardFillPresets } from '@angular22/wizard-core';
import { emptyAddress, emptyLanguage, emptyPhone } from '@angular22/wizard-core';

import { applicableConsents } from './consents-catalog';
import { KRS_REQUIRED_FORMS } from './dictionaries';
import { buildBusinessPreset } from './fill-preset';
import { businessWizardSchema } from './form-schema';
import type { BusinessData } from './models';
import { emptyRepresentative, initialBusinessData } from './models';

/**
 * Root-scoped store of the business wizard — owns the model signal and the
 * Signal Forms field tree built from it.
 */
@Injectable({ providedIn: 'root' })
export class BusinessWizardStore implements WizardFillPresets {
  private readonly model = signal<BusinessData>(initialBusinessData());

  /** Signal Forms field tree — bind leaves with `[formField]`. */
  readonly form = form(this.model, businessWizardSchema);

  /** Read-only model snapshot. */
  readonly data = this.model.asReadonly();

  /** Whether the selected legal form legally requires a KRS number. */
  readonly krsRequired = computed(() => KRS_REQUIRED_FORMS.has(this.model().companyBasics.legalForm));

  readonly submitted = signal(false);

  constructor() {
    // Rebuild the consent list whenever industry / segment / export change,
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
      contact: { ...m.contact, phones: [...m.contact.phones, emptyPhone('office')] },
    }));
  }

  removePhone(index: number): void {
    this.model.update((m) =>
      m.contact.phones.length > 1
        ? { ...m, contact: { ...m.contact, phones: m.contact.phones.filter((_, i) => i !== index) } }
        : m,
    );
  }

  addAddress(purpose = 'branch'): void {
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
      profile: { ...m.profile, workingLanguages: [...m.profile.workingLanguages, emptyLanguage()] },
    }));
  }

  removeLanguage(index: number): void {
    this.model.update((m) =>
      m.profile.workingLanguages.length > 1
        ? {
            ...m,
            profile: { ...m.profile, workingLanguages: m.profile.workingLanguages.filter((_, i) => i !== index) },
          }
        : m,
    );
  }

  addRepresentative(): void {
    this.model.update((m) => ({
      ...m,
      representatives: { items: [...m.representatives.items, emptyRepresentative()] },
    }));
  }

  removeRepresentative(index: number): void {
    this.model.update((m) =>
      m.representatives.items.length > 1
        ? { ...m, representatives: { items: m.representatives.items.filter((_, i) => i !== index) } }
        : m,
    );
  }

  // ── Dev-fill presets (WIZARD_FILL_PRESETS) ────────────────────────────

  fill(mode: FillMode): void {
    this.model.set(buildBusinessPreset(mode));
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
    this.form().reset(initialBusinessData());
    this.submitted.set(false);
  }
}
