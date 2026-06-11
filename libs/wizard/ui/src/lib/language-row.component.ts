import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import { A22ButtonComponent, A22SelectComponent } from '@angular22/ui-material';
import type { LanguageValue } from '@angular22/wizard-core';
import { LANGUAGE_CODES, LANGUAGE_LEVELS } from '@angular22/wizard-core';

/** One language row — code + CEFR level selects + remove button. */
@Component({
  selector: 'a22-language-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22ButtonComponent, A22SelectComponent, FormField],
  templateUrl: './language-row.component.html',
  styleUrl: './language-row.component.scss',
})
export class A22LanguageRowComponent {
  readonly field = input.required<FieldTree<LanguageValue>>();
  readonly removable = input(false);
  readonly remove = output<void>();

  protected readonly codes = LANGUAGE_CODES;
  protected readonly levels = LANGUAGE_LEVELS;
}
