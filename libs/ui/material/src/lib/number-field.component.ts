import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import type { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { A22FieldErrorComponent } from './field-error.component';

/**
 * `<a22-number-field>` — Material numeric input wrapped as a Signal Forms
 * custom control (`FormValueControl<number | null>`). Empty input maps to
 * `null` in the model.
 */
@Component({
  selector: 'a22-number-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22FieldErrorComponent, MatFormFieldModule, MatInputModule],
  host: { '[style.display]': "hidden() ? 'none' : 'block'" },
  templateUrl: './number-field.component.html',
  styleUrl: './number-field.component.scss',
})
export class A22NumberFieldComponent implements FormValueControl<number | null> {
  readonly value = model<number | null>(null);
  readonly touched = model(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly hidden = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  readonly label = input.required<string>();
  readonly suffix = input('');
  readonly hint = input('');
  readonly testId = input('');

  protected readonly showError = computed(() => this.touched() && this.invalid());
  protected readonly displayValue = computed(() => {
    const value = this.value();
    return value === null ? '' : String(value);
  });

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const parsed = Number(raw);
    this.value.set(raw === '' || Number.isNaN(parsed) ? null : parsed);
  }
}
