import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentaService } from '../data-access/cuenta.service';
import { SaldoCardComponent } from '../ui/saldo-card/saldo-card.component';
import { CuentaInfoCardComponent } from '../ui/cuenta-info-card/cuenta-info-card.component';
import { OperacionesMenuComponent, OperacionTipo } from '../ui/operaciones-menu/operaciones-menu.component';
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
    CuentaInfoCardComponent,
    OperacionesMenuComponent,
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
  private readonly paginaMovimientos = signal(1);

  private get cuentaId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit(): void {
    this.service.limpiarCuenta();
    this.service.cargarCuenta(this.cuentaId);
    this.service.cargarMovimientos(this.cuentaId, 1, 10);
  }

  protected onOperacion(tipo: OperacionTipo): void {
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
    this.service.consignar(this.cuentaId, req).subscribe((result) => {
      if (result.isSuccess) {
        this.notificacion.mostrarExito('Consignacion realizada exitosamente.');
        this.operacionActiva.set(null);
        this.service.cargarMovimientos(this.cuentaId, 1, 10);
      }
    });
  }

  protected onRetirar(req: RetirarRequest): void {
    this.service.retirar(this.cuentaId, req).subscribe((result) => {
      if (result.isSuccess) {
        this.notificacion.mostrarExito('Retiro realizado exitosamente.');
        this.operacionActiva.set(null);
        this.service.cargarMovimientos(this.cuentaId, 1, 10);
      }
    });
  }

  protected onPaginaMovimientosCambiada(pagina: number): void {
    this.paginaMovimientos.set(pagina);
    this.service.cargarMovimientos(this.cuentaId, pagina, 10);
  }

  protected onVolver(): void {
    this.router.navigate(['/cuentas']);
  }
}
