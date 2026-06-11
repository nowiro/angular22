import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import { A22ButtonComponent, A22SelectComponent, A22TextFieldComponent } from '@angular22/ui-material';
import type { Option, PhoneValue } from '@angular22/wizard-core';

/**
 * One phone row — type select + number + optional extension + remove button.
 * The individual wizard hides the extension column; the business one shows it.
 */
@Component({
  selector: 'a22-phone-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22ButtonComponent, A22SelectComponent, A22TextFieldComponent, FormField],
  templateUrl: './phone-row.component.html',
  styleUrl: './phone-row.component.scss',
})
export class A22PhoneRowComponent {
  readonly field = input.required<FieldTree<PhoneValue>>();
  readonly typeOptions = input.required<readonly Option<string>[]>();
  readonly showExtension = input(false);
  readonly removable = input(false);
  readonly remove = output<void>();
}
