import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import type { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { A22FieldErrorComponent } from './field-error.component';

/**
 * `<a22-date-field>` — Material datepicker wrapped as a Signal Forms custom
 * control (`FormValueControl<Date | null>`). Ships its own native `Date`
 * adapter so consuming apps need no Material providers.
 */
@Component({
  selector: 'a22-date-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22FieldErrorComponent, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  providers: [provideNativeDateAdapter()],
  host: { '[style.display]': "hidden() ? 'none' : 'block'" },
  templateUrl: './date-field.component.html',
  styleUrl: './date-field.component.scss',
})
export class A22DateFieldComponent implements FormValueControl<Date | null> {
  readonly value = model<Date | null>(null);
  readonly touched = model(false);
  readonly disabled = input(false);
  readonly hidden = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  readonly label = input.required<string>();
  readonly hint = input('');
  readonly testId = input('');

  protected readonly showError = computed(() => this.touched() && this.invalid());

  protected onDate(value: Date | null): void {
    this.value.set(value);
    this.touched.set(true);
  }
}
