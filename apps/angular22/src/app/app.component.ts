import { ChangeDetectionStrategy, Component } from '@angular/core';

import { A22CardComponent, A22IconComponent, A22ToolbarComponent } from '@angular22/ui-material';

/** Landing page — links both wizard demos and summarises the stack. */
@Component({
  selector: 'a22-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A22CardComponent, A22IconComponent, A22ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
