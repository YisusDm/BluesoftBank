import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TransaccionDto, TipoTransaccion } from '../../data-access/cuenta.models';
import { CurrencyColombianPipe } from '../../../../shared/pipes/currency-colombian.pipe';
import { FechaRelativaPipe } from '../../../../shared/pipes/fecha-relativa.pipe';

@Component({
  selector: 'app-transaccion-row',
  standalone: true,
  imports: [CurrencyColombianPipe, FechaRelativaPipe],
  templateUrl: './transaccion-row.component.html',
  styleUrl: './transaccion-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransaccionRowComponent {
  transaccion = input.required<TransaccionDto>();

  protected readonly TipoTransaccion = TipoTransaccion;
}
