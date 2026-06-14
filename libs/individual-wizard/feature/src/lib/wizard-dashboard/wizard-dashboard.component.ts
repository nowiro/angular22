import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { IndividualWizardStepIndex } from '@angular22/individual-wizard-data';
import { IndividualWizardStore, WizardNav } from '@angular22/individual-wizard-data';
import { A22LanguageSwitcherComponent, A22TranslatePipe } from '@angular22/shared-i18n';
import { A22IconComponent, A22ToolbarComponent } from '@angular22/ui-material';
import type { WizardStepStatus, WizardTileDescriptor } from '@angular22/wizard-core';
import { STEP_STATUS_LABELS, stepStatus } from '@angular22/wizard-core';

const TILES: readonly WizardTileDescriptor<IndividualWizardStepIndex>[] = [
  { step: 1, icon: 'badge', title: 'Dane podstawowe', subtitle: 'Imię, nazwisko, PESEL, data urodzenia' },
  { step: 2, icon: 'contact_mail', title: 'Kontakt', subtitle: 'E-mail, telefony, adresy' },
  { step: 3, icon: 'checklist', title: 'Ankieta', subtitle: 'Wykształcenie, zatrudnienie, języki' },
  { step: 4, icon: 'fact_check', title: 'Zgody i sprzeciwy', subtitle: 'RODO, marketing, weryfikacje' },
  { step: 5, icon: 'summarize', title: 'Podsumowanie', subtitle: 'Przegląd danych i wysyłka' },
];

/** Dashboard — 5 deep-linking tiles with live form-state statuses. */
@Component({
  selector: 'a22-wizard-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22LanguageSwitcherComponent, A22TranslatePipe, A22IconComponent, A22ToolbarComponent, RouterLink],
  templateUrl: './wizard-dashboard.component.html',
  styleUrl: './wizard-dashboard.component.scss',
})
export class WizardDashboardComponent {
  private readonly store = inject(IndividualWizardStore);

  protected readonly tiles = TILES;
  protected readonly statusLabels = STEP_STATUS_LABELS;
  protected readonly wizardLink = WizardNav.wizard();

  protected readonly statuses = computed<Record<IndividualWizardStepIndex, WizardStepStatus>>(() => {
    const form = this.store.form;
    return {
      1: stepStatus(form.basicData()),
      2: stepStatus(form.contact()),
      3: stepStatus(form.survey()),
      4: stepStatus(form.consents()),
      5: stepStatus(form()),
    };
  });

  protected stepLink(step: IndividualWizardStepIndex): readonly ['/wizard', IndividualWizardStepIndex] {
    return WizardNav.wizardStep(step);
  }
}
