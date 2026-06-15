import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { I18nStore } from '@angular22/shared-i18n';

/** Snackbar wrapper — the one seam for Material toast notifications. */
@Injectable({ providedIn: 'root' })
export class A22NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly i18n = inject(I18nStore);

  show(message: string): void {
    this.snackBar.open(message, this.i18n.t('OK'), { duration: 4000 });
  }

  /**
   * Error toast for failed API/network operations — longer-lived, dismissible,
   * and styled with the error-container palette (see `.a22-snackbar-error` in
   * the shared app-shell styles). The message arrives already translated; the
   * action label is translated here (PL source = key) so it follows the active
   * language too — otherwise it would stay Polish on the EN UI.
   */
  error(message: string, action = 'Zamknij'): void {
    this.snackBar.open(message, this.i18n.t(action), { duration: 6000, panelClass: 'a22-snackbar-error' });
  }
}
