import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CargaService } from '../../../core/services/carga.service';

@Component({
  selector: 'app-cargando',
  imports: [AsyncPipe],
  templateUrl: './cargando.component.html',
  styleUrl: './cargando.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CargandoComponent {
  private readonly cargaService = inject(CargaService);

  readonly mensaje = input('Procesando...');
  readonly cargando$ = this.cargaService.esCargando$;
}
