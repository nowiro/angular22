import { inject, Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

import { I18nStore } from './i18n-store';

/**
 * `{{ 'Polski tekst' | a22T }}` — translates a Polish source string via
 * {@link I18nStore}. Impure on purpose: a pure pipe memoises per input and
 * would skip re-translation when only the language signal changes; the signal
 * read inside `transform` keeps the template reactive in zoneless mode.
 */
@Pipe({ name: 'a22T', pure: false })
export class A22TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nStore);

  transform(value: string): string {
    return this.i18n.t(value);
  }
}
