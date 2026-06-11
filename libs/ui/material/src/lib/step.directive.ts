import { Directive, inject, input, TemplateRef } from '@angular/core';

/**
 * Marks an `<ng-template>` as one step of `<a22-wizard-stepper>`; the input
 * value is the step label:
 *
 * ```html
 * <a22-wizard-stepper>
 *   <ng-template a22Step="Dane podstawowe">…</ng-template>
 * </a22-wizard-stepper>
 * ```
 */
@Directive({ selector: 'ng-template[a22Step]' })
export class A22StepDirective {
  readonly a22Step = input.required<string>();
  readonly template = inject(TemplateRef<unknown>);
}
