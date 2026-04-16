import { ChangeDetectionStrategy, Component, model } from '@angular/core';

export type TipoCuentaSeleccion = 'CuentaAhorro' | 'CuentaCorriente';

@Component({
  selector: 'app-crear-cuenta-tipo-selector',
  standalone: true,
  templateUrl: './crear-cuenta-tipo-selector.component.html',
  styleUrl: './crear-cuenta-tipo-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearCuentaTipoSelectorComponent {
  tipo = model.required<TipoCuentaSeleccion>();
}
