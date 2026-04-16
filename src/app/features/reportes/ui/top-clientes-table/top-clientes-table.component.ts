import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TopClienteDto } from '../../data-access/reporte.models';
import { TopClienteRowComponent } from '../top-cliente-row/top-cliente-row.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-top-clientes-table',
  standalone: true,
  imports: [TopClienteRowComponent, EmptyStateComponent],
  templateUrl: './top-clientes-table.component.html',
  styleUrl: './top-clientes-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopClientesTableComponent {
  clientes = input.required<TopClienteDto[]>();
}
