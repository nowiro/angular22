import { ChangeDetectionStrategy, Component } from '@angular/core';

import { A22TranslatePipe } from '@angular22/shared-i18n';

/**
 * Error view for the embedded-app host. Rendered dynamically via
 * `ngComponentOutlet` when the element bundle fails to load (the host also
 * surfaces a snackbar). Kept as its own component so the host can pick between
 * spinner and error views at runtime.
 */
@Component({
  selector: 'a22-embed-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22TranslatePipe],
  templateUrl: './embed-error.component.html',
  styleUrl: './embed-error.component.scss',
})
export class EmbedErrorComponent {}
