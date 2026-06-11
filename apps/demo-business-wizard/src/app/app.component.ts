import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { A22DevFillPanelComponent } from '@angular22/wizard-form-fill';

/**
 * Root shell — routed pages (dashboard / stepper) plus the global dev-fill
 * panel (localhost-only).
 */
@Component({
  selector: 'a22-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22DevFillPanelComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
