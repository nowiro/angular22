import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/**
 * `<a22-card>` — Material outlined card with optional header. Body is
 * projected content.
 */
@Component({
  selector: 'a22-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class A22CardComponent {
  readonly title = input('');
  readonly subtitle = input('');
}
