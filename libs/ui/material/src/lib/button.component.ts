import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * `<a22-button>` — Material button wrapper. Variants map to M3 button kinds:
 * `filled` (primary action), `outlined`, `tonal`, `text` and `icon`.
 *
 * The label is an INPUT (not projected content): the variant branches live in
 * a `@switch`, and `ng-content` inside conditional branches silently drops
 * projected nodes. Listen with a plain `(click)` on the host.
 */
export type A22ButtonVariant = 'filled' | 'outlined' | 'tonal' | 'text' | 'icon';

@Component({
  selector: 'a22-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class A22ButtonComponent {
  readonly variant = input<A22ButtonVariant>('filled');
  readonly label = input('');
  readonly icon = input('');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly ariaLabel = input('');
  readonly testId = input('');
}
