import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentaService } from '../data-access/cuenta.service';
import { SaldoCardComponent } from '../ui/saldo-card/saldo-card.component';
import { OperacionTipo } from '../ui/operaciones-menu/operaciones-menu.component';
import { ConsignarFormComponent } from '../ui/consignar-form/consignar-form.component';
import { RetirarFormComponent } from '../ui/retirar-form/retirar-form.component';
import { MovimientosListComponent } from '../ui/movimientos-list/movimientos-list.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { ConsignarRequest, RetirarRequest } from '../data-access/cuenta.models';

@Component({
  selector: 'app-cuenta-detail-page',
  standalone: true,
  imports: [
    SaldoCardComponent,
    ConsignarFormComponent,
    RetirarFormComponent,
    MovimientosListComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './cuenta-detail.page.html',
  styleUrl: './cuenta-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentaDetailPage implements OnInit {
  protected readonly service = inject(CuentaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificacion = inject(NotificacionService);

  protected readonly operacionActiva = signal<OperacionTipo | null>(null);
  protected readonly operacionEnCurso = signal(false);
  private readonly paginaMovimientos = signal(1);
  private readonly manejoErrorRealizado = signal(false);

  private get cuentaId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  constructor() {
    effect(() => {
      const error = this.service.error();
      const cuenta = this.service.cuenta();

      if (!error || cuenta || this.manejoErrorRealizado()) {
        return;
      }

      const esCuentaNoDisponible =
        error.toLowerCase().includes('no existe') ||
        error.toLowerCase().includes('account_not_found') ||
        error.toLowerCase().includes('modificada por otro proceso') ||
        error.toLowerCase().includes('conflicto de concurrencia');

      if (esCuentaNoDisponible) {
        this.manejoErrorRealizado.set(true);
        this.notificacion.mostrarAdvertencia(
          'La cuenta ya no esta disponible.',
          'Se actualizo el listado para mostrar el estado mas reciente.'
        );
        this.router.navigate(['/cuentas']);
      }
    });
  }

  ngOnInit(): void {
    this.manejoErrorRealizado.set(false);

    if (!this.cuentaId) {
      this.notificacion.mostrarAdvertencia(
        'No se encontro el identificador de la cuenta.',
        'Selecciona la cuenta nuevamente desde el listado.'
      );
      this.router.navigate(['/cuentas']);
      return;
    }

    this.service.limpiarCuenta();
    this.recargarDatos(1);
  }

  protected onOperacion(tipo: OperacionTipo): void {
    if (this.operacionEnCurso()) {
      return;
    }

    if (tipo === 'extracto') {
      this.router.navigate(['/cuentas', this.cuentaId, 'extracto']);
      return;
    }
    this.operacionActiva.set(tipo);
  }

  protected onCancelarOperacion(): void {
    this.operacionActiva.set(null);
  }

  protected onConsignar(req: ConsignarRequest): void {
    if (this.operacionEnCurso()) {
      return;
    }

    this.operacionEnCurso.set(true);
    this.service.consignar(this.cuentaId, req).subscribe((result) => {
      if (result.isSuccess) {
        this.notificacion.mostrarExito('Consignacion realizada exitosamente.');
        this.operacionActiva.set(null);
        this.recargarDatos(1);
      } else {
        this.recargarDatos(this.paginaMovimientos());
      }

      this.operacionEnCurso.set(false);
    });
  }

  protected onRetirar(req: RetirarRequest): void {
    if (this.operacionEnCurso()) {
      return;
    }

    this.operacionEnCurso.set(true);
    this.service.retirar(this.cuentaId, req).subscribe((result) => {
      if (result.isSuccess) {
        this.notificacion.mostrarExito('Retiro realizado exitosamente.');
        this.operacionActiva.set(null);
        this.recargarDatos(1);
      } else {
        this.recargarDatos(this.paginaMovimientos());
      }

      this.operacionEnCurso.set(false);
    });
  }

  protected onPaginaMovimientosCambiada(pagina: number): void {
    this.paginaMovimientos.set(pagina);
    this.service.cargarMovimientos(this.cuentaId, pagina, 10);
  }

  protected onVolver(): void {
    this.router.navigate(['/cuentas']);
  }

  private recargarDatos(paginaMovimientos: number): void {
    this.service.cargarCuenta(this.cuentaId);
    this.service.cargarMovimientos(this.cuentaId, paginaMovimientos, 10);
  }
}
