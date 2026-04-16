import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuentaService } from '../data-access/cuenta.service';
import { CuentasTableComponent } from '../ui/cuentas-table/cuentas-table.component';
import { PaginadorComponent } from '../../../shared/components/paginador/paginador.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CrearCuentaTipoSelectorComponent, TipoCuentaSeleccion } from '../ui/crear-cuenta-tipo-selector/crear-cuenta-tipo-selector.component';
import { CrearCuentaAhorroFormComponent } from '../ui/crear-cuenta-ahorro-form/crear-cuenta-ahorro-form.component';
import { CrearCuentaCorrienteFormComponent } from '../ui/crear-cuenta-corriente-form/crear-cuenta-corriente-form.component';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { CrearCuentaAhorroRequest, CrearCuentaCorrienteRequest } from '../data-access/cuenta.models';

@Component({
  selector: 'app-cuentas-list-page',
  standalone: true,
  imports: [
    CuentasTableComponent,
    PaginadorComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    EmptyStateComponent,
    CrearCuentaTipoSelectorComponent,
    CrearCuentaAhorroFormComponent,
    CrearCuentaCorrienteFormComponent
  ],
  templateUrl: './cuentas-list.page.html',
  styleUrl: './cuentas-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentasListPage implements OnInit {
  protected readonly service = inject(CuentaService);
  private readonly router = inject(Router);
  private readonly notificacion = inject(NotificacionService);

  protected readonly paginaActual = signal(1);
  protected readonly mostrarDialog = signal(false);
  protected readonly tipoSeleccionado = signal<TipoCuentaSeleccion>('CuentaAhorro');
  protected readonly TAMANO = 10;

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.service.cargarCuentas(this.paginaActual(), this.TAMANO);
  }

  protected onPaginaCambiada(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargar();
  }

  protected onVerDetalle(id: string): void {
    if (!id) {
      this.notificacion.mostrarError(
        'No fue posible abrir el detalle de la cuenta porque falta el identificador.'
      );
      return;
    }

    this.router.navigate(['/cuentas', id]);
  }

  protected onAbrirDialog(): void {
    this.mostrarDialog.set(true);
  }

  protected onCerrarDialog(): void {
    this.mostrarDialog.set(false);
  }

  protected onCrearAhorro(req: CrearCuentaAhorroRequest): void {
    this.service.crearCuentaAhorro(req).subscribe((result) => {
      if (result.isSuccess && result.value) {
        this.notificacion.mostrarExito('Cuenta de ahorro creada exitosamente.');
        this.mostrarDialog.set(false);
        this.cargar();
        this.router.navigate(['/cuentas', result.value.cuentaId]);
      }
    });
  }

  protected onCrearCorriente(req: CrearCuentaCorrienteRequest): void {
    this.service.crearCuentaCorriente(req).subscribe((result) => {
      if (result.isSuccess && result.value) {
        this.notificacion.mostrarExito('Cuenta corriente creada exitosamente.');
        this.mostrarDialog.set(false);
        this.cargar();
        this.router.navigate(['/cuentas', result.value.cuentaId]);
      }
    });
  }
}
