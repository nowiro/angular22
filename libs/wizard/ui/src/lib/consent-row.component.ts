import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22CheckboxComponent } from '@angular22/ui-material';
import type { ConsentItemValue } from '@angular22/wizard-core';

/**
 * A single consent row — checkbox + label + "required" badge. Binds the
 * `granted` leaf of a `FieldTree<ConsentItemValue>`; the catalog metadata
 * (key / label / required) is read from the field value.
 */
@Component({
  selector: 'a22-consent-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22CheckboxComponent, A22TranslatePipe, FormField],
  templateUrl: './consent-row.component.html',
  styleUrl: './consent-row.component.scss',
})
export class A22ConsentRowComponent {
  readonly field = input.required<FieldTree<ConsentItemValue>>();
  /** Optional long description rendered under the checkbox row. */
  readonly description = input('');

  protected readonly item = computed(() => this.field()().value());
}
