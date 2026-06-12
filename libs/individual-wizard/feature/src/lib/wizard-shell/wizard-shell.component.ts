import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import type { IndividualWizardStepIndex } from '@angular22/individual-wizard-data';
import { INDIVIDUAL_WIZARD_STEP_COUNT, WizardNav } from '@angular22/individual-wizard-data';
import { A22LanguageSwitcherComponent, A22TranslatePipe } from '@angular22/shared-i18n';
import {
  A22ButtonComponent,
  A22IconComponent,
  A22StepDirective,
  A22ToolbarComponent,
  A22WizardStepperComponent,
} from '@angular22/ui-material';

import { StepBasicDataComponent } from '../steps/step-basic-data.component';
import { StepConsentsComponent } from '../steps/step-consents.component';
import { StepContactComponent } from '../steps/step-contact.component';
import { StepSummaryComponent } from '../steps/step-summary.component';
import { StepSurveyComponent } from '../steps/step-survey.component';

/**
 * Top-level wizard shell — non-linear stepper over the 5 step components.
 *
 * Two hosting modes:
 * - **Standalone app** — the selected step is driven by the `:step` route
 *   param (1-indexed, bound via `withComponentInputBinding()`); user
 *   navigation pushes back to the router with `replaceUrl`.
 * - **Embedded web component** (`embedded` attribute set by the portal) —
 *   the chrome (toolbar + intro) is hidden, there is NO router in the
 *   element's injector, and the step lives in a local signal instead of
 *   the URL.
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
    StepBasicDataComponent,
    StepConsentsComponent,
    StepContactComponent,
    StepSummaryComponent,
    StepSurveyComponent,
  ],
  templateUrl: './wizard-shell.component.html',
  styleUrl: './wizard-shell.component.scss',
})
export class WizardShellComponent {
  /** Absent when hosted as a web component (no provideRouter in the element). */
  private readonly router = inject(Router, { optional: true });

  /** Embedded mode (portal web component) — hides the toolbar + intro chrome. */
  readonly embedded = input(false, { transform: booleanAttribute });

  /** Route-bound `:step` param (1..5). `/wizard` (no param) falls back to 1. */
  readonly step = input<string | undefined>(undefined);

  /** Step state for the router-less (embedded) mode, 1-indexed like the URL. */
  private readonly localStep = signal<IndividualWizardStepIndex>(1);

  protected readonly dashboardLink = WizardNav.dashboard();

  /** Stepper is 0-indexed; the URL uses 1..5. Out-of-range clamps to step 1. */
  protected readonly selectedIndex = computed(() => {
    const raw = this.router !== null ? Number(this.step()) : this.localStep();
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(INDIVIDUAL_WIZARD_STEP_COUNT - 1, raw - 1));
  });

  protected onStepChange(index: number): void {
    const nextStep = (index + 1) as IndividualWizardStepIndex;
    if (this.router === null) {
      this.localStep.set(nextStep);
      return;
    }
    if (Number(this.step()) === nextStep) return;
    void this.router.navigate(WizardNav.wizardStep(nextStep), { replaceUrl: true });
  }
}
