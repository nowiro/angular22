import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';

// The element entry (element.ts) is a SEPARATE bundle from main.ts; the feature lib is
// lazy-loaded in the standalone app's routes but bundled eagerly into the element, so the
// static import legitimately trips @nx/enforce-module-boundaries' lazy-load rule.
// eslint-disable-next-line @nx/enforce-module-boundaries -- separate eager element bundle, see above
import { WizardShellComponent } from '@angular22/business-wizard-feature';
import { I18nStore } from '@angular22/shared-i18n';
import { A22DevFillPanelComponent } from '@angular22/wizard-form-fill';

/**
 * Web-component root — wraps the wizard shell in embedded mode (no toolbar,
 * no router; step state is local). The portal pushes its active language via
 * the `lang` attribute so both Angular runtimes stay in sync.
 */
@Component({
  selector: 'a22-business-wizard-element',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22DevFillPanelComponent, WizardShellComponent],
  templateUrl: './element.component.html',
  styleUrl: './element.component.scss',
})
export class BusinessWizardElementComponent {
  private readonly i18n = inject(I18nStore);

  /** Host-page language (`lang="pl|en"` attribute set by the portal). */
  readonly lang = input<string | undefined>(undefined);

  constructor() {
    effect(() => {
      const lang = this.lang();
      if (lang === 'pl' || lang === 'en') this.i18n.setLanguage(lang);
    });
  }
}
