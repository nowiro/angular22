import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { A22LanguageSwitcherComponent, A22TranslatePipe } from '@angular22/shared-i18n';
import { A22IconComponent, A22ToolbarComponent } from '@angular22/ui-material';

/**
 * Base app root — a persistent header (brand + language switcher) over an empty
 * router outlet. This is the workspace's starter app: copy `apps/base` +
 * `apps/base-e2e` to stand up a new application fast (see `apps/base/README.md`).
 */
@Component({
  selector: 'a22-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22IconComponent, A22LanguageSwitcherComponent, A22ToolbarComponent, A22TranslatePipe, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
