import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { FeatureId } from '@angular22/shared-config';
import { FeatureFlagsStore } from '@angular22/shared-config';
import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22IconComponent } from '@angular22/ui-material';

interface PortalTile {
  readonly id: FeatureId;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly embedLink: readonly string[];
}

const TILES: readonly PortalTile[] = [
  {
    id: 'individual-wizard',
    icon: 'badge',
    title: 'Kreator danych osobowych',
    description:
      '5 kroków: dane podstawowe (PESEL), kontakt, warunkowa ankieta, zgody i podsumowanie — w 100% na Signal Forms.',
    embedLink: ['/apps/individual'],
  },
  {
    id: 'business-wizard',
    icon: 'domain',
    title: 'Kreator danych firmy',
    description:
      '6 kroków: dane rejestrowe (NIP/REGON/KRS), kontakt, profil działalności, reprezentanci, zgody i podsumowanie.',
    embedLink: ['/apps/business'],
  },
];

/** Portal home — one tile per ENABLED feature, with new-tab + in-portal actions. */
@Component({
  selector: 'a22-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22IconComponent, A22TranslatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly flags = inject(FeatureFlagsStore);

  protected readonly enabledTiles = computed(() => TILES.filter((tile) => this.flags.isEnabled(tile.id)));

  protected standaloneUrl(id: FeatureId): string {
    return this.flags.feature(id).standaloneUrl;
  }

  protected canEmbed(id: FeatureId): boolean {
    return this.flags.feature(id).element !== undefined;
  }
}
