import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

import { errorMessage } from './error-message';

/**
 * Renders the first error of an error list as an inline alert. Field wrappers
 * in this lib embed it below the `mat-form-field`; feature code can reuse it
 * for root-level (cross-field) errors.
 */
@Component({
  selector: 'a22-field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
})
export class A22FieldErrorComponent {
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  protected readonly message = computed(() => errorMessage(this.errors()));
}
