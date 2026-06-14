import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

import { A22TranslatePipe } from '@angular22/shared-i18n';

import { errorMessage } from './error-message';

/**
 * Renders the first error of an error list as an inline alert. Field wrappers
 * in this lib embed it below the `mat-form-field`; feature code can reuse it
 * for root-level (cross-field) errors.
 */
@Component({
  selector: 'a22-field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22TranslatePipe],
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
})
export class A22FieldErrorComponent {
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  /** Stable element id so a host control can point `aria-describedby` at the error. */
  readonly errorId = input('');

  protected readonly message = computed(() => errorMessage(this.errors()));
}
