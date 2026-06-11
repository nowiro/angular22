import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { A22DevFillPanelComponent } from '@angular22/wizard-form-fill';

/**
 * Root shell — routed pages (dashboard / stepper) plus the global dev-fill
 * panel. The panel is mounted once at the root so its state survives
 * navigation; it renders only on localhost.
 */
@Component({
  selector: 'a22-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22DevFillPanelComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
