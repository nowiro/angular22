import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import type { IndividualWizardStepIndex } from '@angular22/individual-wizard-data';
import { INDIVIDUAL_WIZARD_STEP_COUNT, WizardNav } from '@angular22/individual-wizard-data';
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
 * The selected step is driven by the `:step` route param (1-indexed, bound
 * via `withComponentInputBinding()`); user navigation pushes back to the
 * router with `replaceUrl` so history stays clean.
 */
@Component({
  selector: 'a22-wizard-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
  private readonly router = inject(Router);

  /** Route-bound `:step` param (1..5). `/wizard` (no param) falls back to 1. */
  readonly step = input<string | undefined>(undefined);

  protected readonly dashboardLink = WizardNav.dashboard();

  /** Stepper is 0-indexed; the URL uses 1..5. Out-of-range clamps to step 1. */
  protected readonly selectedIndex = computed(() => {
    const raw = Number(this.step());
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(INDIVIDUAL_WIZARD_STEP_COUNT - 1, raw - 1));
  });

  protected onStepChange(index: number): void {
    const nextStep = (index + 1) as IndividualWizardStepIndex;
    if (Number(this.step()) === nextStep) return;
    void this.router.navigate(WizardNav.wizardStep(nextStep), { replaceUrl: true });
  }
}
