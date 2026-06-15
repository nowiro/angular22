import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Snackbar wrapper — the one seam for Material toast notifications. */
@Injectable({ providedIn: 'root' })
export class A22NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  show(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 4000 });
  }

  /**
   * Error toast for failed API/network operations — longer-lived, dismissible,
   * and styled with the error-container palette (see `.a22-snackbar-error` in
   * the shared app-shell styles). Messages arrive already translated.
   */
  error(message: string, action = 'Zamknij'): void {
    this.snackBar.open(message, action, { duration: 6000, panelClass: 'a22-snackbar-error' });
  }
}
