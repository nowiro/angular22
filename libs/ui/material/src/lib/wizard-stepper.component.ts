import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import type { StepperSelectionEvent } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChildren, inject, model, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

import { map } from 'rxjs';

import { A22StepDirective } from './step.directive';

/**
 * `<a22-wizard-stepper>` — Material stepper wrapper. Steps are declared as
 * `<ng-template a22Step="Label">` children; `selectedIndex` is a two-way
 * model so the host can drive it from the route. Orientation flips to
 * vertical on handset widths (CDK BreakpointObserver stays inside this lib).
 *
 * Navigation buttons in step content call `next()` / `previous()` through a
 * template reference: `<a22-wizard-stepper #stepper>` … `(click)="stepper.next()"`.
 */
@Component({
  selector: 'a22-wizard-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatStepperModule, NgTemplateOutlet],
  templateUrl: './wizard-stepper.component.html',
  styleUrl: './wizard-stepper.component.scss',
})
export class A22WizardStepperComponent {
  private readonly breakpoints = inject(BreakpointObserver);
  private readonly stepper = viewChild.required(MatStepper);

  /** Two-way bindable 0-based step index. */
  readonly selectedIndex = model(0);

  protected readonly steps = contentChildren(A22StepDirective);

  private readonly isHandset = toSignal(
    this.breakpoints.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  protected readonly orientation = computed(() => (this.isHandset() ? ('vertical' as const) : ('horizontal' as const)));

  next(): void {
    this.stepper().next();
  }

  previous(): void {
    this.stepper().previous();
  }

  protected onSelectionChange(event: StepperSelectionEvent): void {
    this.selectedIndex.set(event.selectedIndex);
  }
}
