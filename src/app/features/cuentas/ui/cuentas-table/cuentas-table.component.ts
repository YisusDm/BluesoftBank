import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CuentaDto } from '../../data-access/cuenta.models';
import { CuentaTipoBadgeComponent } from '../cuenta-tipo-badge/cuenta-tipo-badge.component';
import { CurrencyColombianPipe } from '../../../../shared/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-cuentas-table',
  standalone: true,
  imports: [CuentaTipoBadgeComponent, CurrencyColombianPipe],
  templateUrl: './cuentas-table.component.html',
  styleUrl: './cuentas-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentasTableComponent {
  cuentas = input.required<CuentaDto[]>();
  verDetalle = output<string>();
}
