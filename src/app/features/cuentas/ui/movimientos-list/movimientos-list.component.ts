import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MovimientosPagedResponse } from '../../data-access/cuenta.models';
import { TransaccionRowComponent } from '../transaccion-row/transaccion-row.component';
import { PaginadorComponent } from '../../../../shared/components/paginador/paginador.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-movimientos-list',
  standalone: true,
  imports: [TransaccionRowComponent, PaginadorComponent, EmptyStateComponent],
  templateUrl: './movimientos-list.component.html',
  styleUrl: './movimientos-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientosListComponent {
  datos = input.required<MovimientosPagedResponse | null>();
  paginaCambiada = output<number>();
}
