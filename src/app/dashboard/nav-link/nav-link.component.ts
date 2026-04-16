import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-link.component.html',
  styleUrl: './nav-link.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavLinkComponent {
  ruta = input.required<string>();
  etiqueta = input.required<string>();
}
