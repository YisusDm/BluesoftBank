import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CuentaDto } from '../../data-access/cuenta.models';
import { CuentaTipoBadgeComponent } from '../cuenta-tipo-badge/cuenta-tipo-badge.component';

@Component({
  selector: 'app-cuenta-info-card',
  standalone: true,
  imports: [CuentaTipoBadgeComponent],
  templateUrl: './cuenta-info-card.component.html',
  styleUrl: './cuenta-info-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentaInfoCardComponent {
  cuenta = input.required<CuentaDto>();
}
