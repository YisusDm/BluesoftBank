import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CuentaDto } from '../../data-access/cuenta.models';
import { CuentaTipoBadgeComponent } from '../cuenta-tipo-badge/cuenta-tipo-badge.component';
import { CurrencyColombianPipe } from '../../../../shared/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-cuenta-row',
  standalone: true,
  imports: [CuentaTipoBadgeComponent, CurrencyColombianPipe],
  templateUrl: './cuenta-row.component.html',
  styleUrl: './cuenta-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentaRowComponent {
  cuenta = input.required<CuentaDto>();
  verDetalle = output<string>();
}
