import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthStore } from '@angular22/shared-auth';
import { A22TranslatePipe } from '@angular22/shared-i18n';
import { A22IconComponent } from '@angular22/ui-material';

/**
 * Admin-only panel — reachable only through `roleGuard('admin')`; a non-admin
 * deep-linking to `/admin` is redirected to `/forbidden`.
 */
@Component({
  selector: 'a22-admin',
  imports: [A22IconComponent, A22TranslatePipe, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  protected readonly username = inject(AuthStore).username;
}
