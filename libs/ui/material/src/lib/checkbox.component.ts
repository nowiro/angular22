import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import type { FormCheckboxControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { A22FieldErrorComponent } from './field-error.component';

/**
 * `<a22-checkbox>` — Material checkbox wrapped as a Signal Forms checkbox
 * control (`FormCheckboxControl`). The label is projected content:
 *
 * ```html
 * <a22-checkbox [formField]="form.meta.acceptTerms">Akceptuję regulamin</a22-checkbox>
 * ```
 */
@Component({
  selector: 'a22-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22FieldErrorComponent, MatCheckboxModule],
  host: { '[style.display]': "hidden() ? 'none' : 'block'" },
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class A22CheckboxComponent implements FormCheckboxControl {
  readonly checked = model(false);
  readonly touched = model(false);
  readonly disabled = input(false);
  readonly hidden = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  readonly testId = input('');

  protected readonly showError = computed(() => this.touched() && this.invalid());

  protected onChange(checked: boolean): void {
    this.checked.set(checked);
    this.touched.set(true);
  }
}
