import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * `<a22-progress-spinner>` — Material indeterminate spinner wrapper for
 * data-loading states. Pair it with `@defer`'s `@loading` block or a
 * `state()`-driven branch. `label` is passed already-translated by the caller
 * (data-driven text stays out of the wrapper).
 */
@Component({
  selector: 'a22-progress-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule],
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.scss',
})
export class A22ProgressSpinnerComponent {
  /** Spinner diameter in px. */
  readonly diameter = input(40);
  /** Optional caption shown under the spinner (also the accessible name). */
  readonly label = input('');
  readonly testId = input('');
}
