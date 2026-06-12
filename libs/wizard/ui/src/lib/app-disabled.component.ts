import { ChangeDetectionStrategy, Component } from '@angular/core';

import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22IconComponent } from '@angular22/ui-material';

/**
 * Full-page "feature disabled" notice — rendered by an app whose feature flag
 * is off in the environment's `config.json` (the app stays on the hosting,
 * only access is blocked).
 */
@Component({
  selector: 'a22-app-disabled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22IconComponent, A22TranslatePipe],
  templateUrl: './app-disabled.component.html',
  styleUrl: './app-disabled.component.scss',
})
export class A22AppDisabledComponent {}
