import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CuentaDto } from '../../data-access/cuenta.models';
import { CuentaRowComponent } from '../cuenta-row/cuenta-row.component';

@Component({
  selector: 'app-cuentas-table',
  standalone: true,
  imports: [CuentaRowComponent],
  templateUrl: './cuentas-table.component.html',
  styleUrl: './cuentas-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentasTableComponent {
  cuentas = input.required<CuentaDto[]>();
  verDetalle = output<string>();
}
