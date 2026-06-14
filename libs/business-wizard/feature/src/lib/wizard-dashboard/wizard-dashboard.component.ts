import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { BusinessWizardStepIndex } from '@angular22/business-wizard-data';
import { BusinessWizardStore, WizardNav } from '@angular22/business-wizard-data';
import { A22LanguageSwitcherComponent, A22TranslatePipe } from '@angular22/shared-i18n';
import { A22IconComponent, A22ToolbarComponent } from '@angular22/ui-material';
import type { WizardStepStatus, WizardTileDescriptor } from '@angular22/wizard-core';
import { STEP_STATUS_LABELS, stepStatus } from '@angular22/wizard-core';

const TILES: readonly WizardTileDescriptor<BusinessWizardStepIndex>[] = [
  { step: 1, icon: 'domain', title: 'Dane firmy', subtitle: 'Nazwa, forma prawna, NIP/REGON/KRS' },
  { step: 2, icon: 'contact_mail', title: 'Kontakt', subtitle: 'E-mail, telefony, adresy' },
  { step: 3, icon: 'insights', title: 'Profil', subtitle: 'Branża, segment, skala, języki' },
  { step: 4, icon: 'groups', title: 'Reprezentanci', subtitle: 'Osoby uprawnione do reprezentacji' },
  { step: 5, icon: 'fact_check', title: 'Zgody', subtitle: 'RODO, PSD2, sankcje, marketing' },
  { step: 6, icon: 'summarize', title: 'Podsumowanie', subtitle: 'Przegląd danych i wysyłka' },
];

/** Dashboard — 6 deep-linking tiles with live form-state statuses. */
@Component({
  selector: 'a22-wizard-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22LanguageSwitcherComponent, A22TranslatePipe, A22IconComponent, A22ToolbarComponent, RouterLink],
  templateUrl: './wizard-dashboard.component.html',
  styleUrl: './wizard-dashboard.component.scss',
})
export class WizardDashboardComponent {
  private readonly store = inject(BusinessWizardStore);

  protected readonly tiles = TILES;
  protected readonly statusLabels = STEP_STATUS_LABELS;
  protected readonly wizardLink = WizardNav.wizard();

  protected readonly statuses = computed<Record<BusinessWizardStepIndex, WizardStepStatus>>(() => {
    const form = this.store.form;
    return {
      1: stepStatus(form.companyBasics()),
      2: stepStatus(form.contact()),
      3: stepStatus(form.profile()),
      4: stepStatus(form.representatives()),
      5: stepStatus(form.consents()),
      6: stepStatus(form()),
    };
  });

  protected stepLink(step: BusinessWizardStepIndex): readonly ['/wizard', BusinessWizardStepIndex] {
    return WizardNav.wizardStep(step);
  }
}
