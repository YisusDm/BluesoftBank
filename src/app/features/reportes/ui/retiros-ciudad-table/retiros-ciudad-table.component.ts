import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RetiroFueraCiudadDto } from '../../data-access/reporte.models';
import { RetiroCiudadRowComponent } from '../retiro-ciudad-row/retiro-ciudad-row.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-retiros-ciudad-table',
  standalone: true,
  imports: [RetiroCiudadRowComponent, EmptyStateComponent],
  templateUrl: './retiros-ciudad-table.component.html',
  styleUrl: './retiros-ciudad-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetirosCiudadTableComponent {
  retiros = input.required<RetiroFueraCiudadDto[]>();
}
