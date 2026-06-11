/**
 * Public API for the shared-i18n library — signal-based runtime i18n.
 * Polish is the default and source language (PL string = translation key);
 * English maps are contributed per app via `provideEnTranslations()`.
 *
 * @packageDocumentation
 */
export { A22_TRANSLATIONS_EN, I18nStore, provideEnTranslations } from './lib/i18n-store';
export type { AppLanguage } from './lib/i18n-store';
export { A22LanguageSwitcherComponent } from './lib/language-switcher.component';
export { COMMON_EN } from './lib/translations-common.en';
export { A22TranslatePipe } from './lib/translate.pipe';
