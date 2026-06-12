import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { A22LanguageSwitcherComponent, A22TranslatePipe } from '@angular22/shared-i18n';
import { A22IconComponent, A22ToolbarComponent } from '@angular22/ui-material';

/** Portal root — persistent header (brand + language switcher) over routed content. */
@Component({
  selector: 'a22-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    A22IconComponent,
    A22LanguageSwitcherComponent,
    A22ToolbarComponent,
    A22TranslatePipe,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly homeLink = ['/'];
}
