import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-cuenta-tipo-badge',
  standalone: true,
  templateUrl: './cuenta-tipo-badge.component.html',
  styleUrl: './cuenta-tipo-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentaTipoBadgeComponent {
  tipo = input.required<'CuentaAhorro' | 'CuentaCorriente' | string>();
}
