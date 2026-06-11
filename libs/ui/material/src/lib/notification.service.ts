import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Snackbar wrapper — the one seam for Material toast notifications. */
@Injectable({ providedIn: 'root' })
export class A22NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  show(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 4000 });
  }
}
