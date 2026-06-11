import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

/** `<a22-divider />` — Material divider wrapper. */
@Component({
  selector: 'a22-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDividerModule],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
})
export class A22DividerComponent {}
