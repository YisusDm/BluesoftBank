import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TopClienteDto } from '../../data-access/reporte.models';

@Component({
  selector: 'app-top-cliente-row',
  standalone: true,
  templateUrl: './top-cliente-row.component.html',
  styleUrl: './top-cliente-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopClienteRowComponent {
  cliente = input.required<TopClienteDto>();
  posicion = input.required<number>();
}
