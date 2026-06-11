import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

/**
 * `<a22-toolbar>` — primary-colored Material toolbar. Content is projected;
 * use `<span class="a22-toolbar-spacer">` to push trailing actions right.
 */
@Component({
  selector: 'a22-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class A22ToolbarComponent {}
