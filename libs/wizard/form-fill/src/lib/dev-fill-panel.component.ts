import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22ButtonComponent, A22IconComponent } from '@angular22/ui-material';
import type { FillMode } from '@angular22/wizard-core';
import { isLocalhost, WIZARD_FILL_PRESETS } from '@angular22/wizard-core';

/**
 * Floating dev-tools panel anchored to the right edge of the viewport.
 * Renders ONLY on localhost (see `isLocalhost`) and delegates the three fill
 * actions to the wizard-provided `WIZARD_FILL_PRESETS`.
 */
@Component({
  selector: 'a22-dev-fill-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22ButtonComponent, A22IconComponent, A22TranslatePipe],
  templateUrl: './dev-fill-panel.component.html',
  styleUrl: './dev-fill-panel.component.scss',
})
export class A22DevFillPanelComponent {
  private readonly presets = inject(WIZARD_FILL_PRESETS);

  protected readonly visible = isLocalhost();
  protected readonly expanded = signal(false);
  protected readonly lastAction = signal('');

  protected toggle(): void {
    this.expanded.update((value) => !value);
  }

  private static readonly ACTION_LABELS: Record<FillMode, string> = {
    required: 'Wypełniono wymagane',
    all: 'Wypełniono wszystkie',
    max: 'Maksymalne zagnieżdżenia',
  };

  protected fill(mode: FillMode): void {
    this.presets.fill(mode);
    this.lastAction.set(A22DevFillPanelComponent.ACTION_LABELS[mode]);
  }
}
