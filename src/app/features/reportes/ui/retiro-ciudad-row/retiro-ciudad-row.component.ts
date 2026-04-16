import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RetiroFueraCiudadDto } from '../../data-access/reporte.models';
import { CurrencyColombianPipe } from '../../../../shared/pipes/currency-colombian.pipe';
import { FechaRelativaPipe } from '../../../../shared/pipes/fecha-relativa.pipe';

@Component({
  selector: 'app-retiro-ciudad-row',
  standalone: true,
  imports: [CurrencyColombianPipe, FechaRelativaPipe],
  templateUrl: './retiro-ciudad-row.component.html',
  styleUrl: './retiro-ciudad-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetiroCiudadRowComponent {
  retiro = input.required<RetiroFueraCiudadDto>();
}
