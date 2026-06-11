import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import type { AppLanguage } from './i18n-store';
import { I18nStore } from './i18n-store';

/** PL/EN toggle for app toolbars; persists the choice via {@link I18nStore}. */
@Component({
  selector: 'a22-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class A22LanguageSwitcherComponent {
  private readonly i18n = inject(I18nStore);

  protected readonly language = this.i18n.language;

  protected set(lang: AppLanguage): void {
    this.i18n.setLanguage(lang);
  }
}
