import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** `<a22-icon name="badge" />` — Material icon wrapper (Material Icons font). */
@Component({
  selector: 'a22-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class A22IconComponent {
  readonly name = input.required<string>();
  /** Optional CSS color (token var or literal). Defaults to inherited color. */
  readonly color = input('');
}
