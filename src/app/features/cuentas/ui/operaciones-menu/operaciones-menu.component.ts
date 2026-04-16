import { ChangeDetectionStrategy, Component, output } from '@angular/core';

export type OperacionTipo = 'consignar' | 'retirar' | 'extracto';

@Component({
  selector: 'app-operaciones-menu',
  standalone: true,
  templateUrl: './operaciones-menu.component.html',
  styleUrl: './operaciones-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperacionesMenuComponent {
  operacionSeleccionada = output<OperacionTipo>();
}
