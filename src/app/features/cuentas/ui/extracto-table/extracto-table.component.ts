import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExtractoDto, TipoTransaccion } from '../../data-access/cuenta.models';
import { CurrencyColombianPipe } from '../../../../shared/pipes/currency-colombian.pipe';
import { FechaRelativaPipe } from '../../../../shared/pipes/fecha-relativa.pipe';

@Component({
  selector: 'app-extracto-table',
  standalone: true,
  imports: [CurrencyColombianPipe, FechaRelativaPipe],
  templateUrl: './extracto-table.component.html',
  styleUrl: './extracto-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtractoTableComponent {
  extracto = input.required<ExtractoDto>();

  protected readonly TipoTransaccion = TipoTransaccion;
}
