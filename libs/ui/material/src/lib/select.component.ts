import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import type { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { A22TranslatePipe } from '@angular22/shared-i18n';
import type { Option } from '@angular22/wizard-core';

import { A22FieldErrorComponent } from './field-error.component';

/**
 * `<a22-select>` — Material select wrapped as a Signal Forms custom control.
 * Generic over the option value union so dictionaries keep their literal
 * types end-to-end:
 *
 * ```html
 * <a22-select [formField]="form.basicData.citizenship" [options]="countries" label="Obywatelstwo" />
 * ```
 */
@Component({
  selector: 'a22-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22FieldErrorComponent, A22TranslatePipe, MatFormFieldModule, MatSelectModule],
  host: { '[style.display]': "hidden() ? 'none' : 'block'" },
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class A22SelectComponent<T extends string> implements FormValueControl<T> {
  readonly value = model<T>(undefined as unknown as T);
  readonly touched = model(false);
  readonly disabled = input(false);
  readonly hidden = input(false);
  readonly invalid = input(false);
  readonly required = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  readonly label = input.required<string>();
  readonly options = input.required<readonly Option<T>[]>();
  readonly hint = input('');
  readonly testId = input('');

  protected readonly showError = computed(() => this.touched() && this.invalid());
  protected readonly errorId = computed(() => (this.testId() ? `${this.testId()}-error` : ''));

  protected onSelection(value: T): void {
    this.value.set(value);
    this.touched.set(true);
  }
}
