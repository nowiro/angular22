import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';

// The element entry (element.ts) is a SEPARATE bundle from main.ts; the feature lib is
// lazy only in the standalone app's routes, while the element bundles the shell eagerly.
// eslint-disable-next-line @nx/enforce-module-boundaries -- separate bundle entry, see above
import { WizardShellComponent } from '@angular22/individual-wizard-feature';
import { I18nStore } from '@angular22/shared-i18n';
import { A22DevFillPanelComponent } from '@angular22/wizard-form-fill';

/**
 * Web-component root — wraps the wizard shell in embedded mode (no toolbar,
 * no router; step state is local). The portal pushes its active language via
 * the `lang` attribute so both Angular runtimes stay in sync.
 */
@Component({
  selector: 'a22-individual-wizard-element',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22DevFillPanelComponent, WizardShellComponent],
  templateUrl: './element.component.html',
  styleUrl: './element.component.scss',
})
export class IndividualWizardElementComponent {
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
