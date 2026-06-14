import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import type { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { A22FieldErrorComponent } from './field-error.component';

/**
 * `<a22-text-field>` — Material text input wrapped as a Signal Forms custom
 * control (`FormValueControl<string>`). Bind with `[formField]`:
 *
 * ```html
 * <a22-text-field [formField]="form.basicData.firstName" label="Imię" />
 * ```
 *
 * The `[formField]` directive keeps `value` / `touched` / `disabled` /
 * `errors` / `invalid` in sync with the bound field — the wrapper renders
 * Material UI and surfaces the first error below the field.
 */
@Component({
  selector: 'a22-text-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22FieldErrorComponent, MatFormFieldModule, MatInputModule],
  host: { '[style.display]': "hidden() ? 'none' : 'block'" },
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
})
export class A22TextFieldComponent implements FormValueControl<string> {
  readonly value = model('');
  readonly touched = model(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly hidden = input(false);
  readonly invalid = input(false);
  readonly required = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'tel'>('text');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly testId = input('');

  protected readonly showError = computed(() => this.touched() && this.invalid());
  protected readonly errorId = computed(() => (this.testId() ? `${this.testId()}-error` : ''));

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
