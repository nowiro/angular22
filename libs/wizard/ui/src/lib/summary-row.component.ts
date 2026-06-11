import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** One label/value row for wizard summaries. Empty values render an em-dash. */
@Component({
  selector: 'a22-summary-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './summary-row.component.html',
  styleUrl: './summary-row.component.scss',
})
export class A22SummaryRowComponent {
  readonly label = input.required<string>();
  readonly value = input<string>('');

  protected readonly displayValue = computed(() => (this.value().trim() === '' ? '—' : this.value()));
}
