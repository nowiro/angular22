import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import type { BusinessWizardStepIndex } from '@angular22/business-wizard-data';
import { BUSINESS_WIZARD_STEP_COUNT, WizardNav } from '@angular22/business-wizard-data';
import { A22LanguageSwitcherComponent, A22TranslatePipe } from '@angular22/shared-i18n';
import {
  A22ButtonComponent,
  A22IconComponent,
  A22StepDirective,
  A22ToolbarComponent,
  A22WizardStepperComponent,
} from '@angular22/ui-material';

import { StepBasicsComponent } from '../steps/step-basics.component';
import { StepConsentsComponent } from '../steps/step-consents.component';
import { StepContactComponent } from '../steps/step-contact.component';
import { StepProfileComponent } from '../steps/step-profile.component';
import { StepRepresentativesComponent } from '../steps/step-representatives.component';
import { StepSummaryComponent } from '../steps/step-summary.component';

/**
 * Top-level wizard shell — non-linear stepper over the 6 step components.
 * The selected step is driven by the `:step` route param (1-indexed).
 */
@Component({
  selector: 'a22-wizard-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    A22LanguageSwitcherComponent,
    A22TranslatePipe,
    A22ButtonComponent,
    A22IconComponent,
    A22StepDirective,
    A22ToolbarComponent,
    A22WizardStepperComponent,
    RouterLink,
    StepBasicsComponent,
    StepConsentsComponent,
    StepContactComponent,
    StepProfileComponent,
    StepRepresentativesComponent,
    StepSummaryComponent,
  ],
  templateUrl: './wizard-shell.component.html',
  styleUrl: './wizard-shell.component.scss',
})
export class WizardShellComponent {
  /** Absent when hosted as a web component (no provideRouter in the element). */
  private readonly router = inject(Router, { optional: true });

  /** Embedded mode (portal web component) — hides the toolbar + intro chrome. */
  readonly embedded = input(false, { transform: booleanAttribute });

  /** Route-bound `:step` param (1..6). `/wizard` (no param) falls back to 1. */
  readonly step = input<string | undefined>(undefined);

  /** Step state for the router-less (embedded) mode, 1-indexed like the URL. */
  private readonly localStep = signal<BusinessWizardStepIndex>(1);

  protected readonly dashboardLink = WizardNav.dashboard();

  /** Stepper is 0-indexed; the URL uses 1..6. Out-of-range clamps to step 1. */
  protected readonly selectedIndex = computed(() => {
    const raw = this.router !== null ? Number(this.step()) : this.localStep();
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(BUSINESS_WIZARD_STEP_COUNT - 1, raw - 1));
  });

  protected onStepChange(index: number): void {
    const nextStep = (index + 1) as BusinessWizardStepIndex;
    if (this.router === null) {
      this.localStep.set(nextStep);
      return;
    }
    if (Number(this.step()) === nextStep) return;
    void this.router.navigate(WizardNav.wizardStep(nextStep), { replaceUrl: true });
  }
}
