import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReporteService } from '../data-access/reporte.service';
import { FiltrosReporte } from '../data-access/reporte.models';
import { ReporteFiltrosComponent } from '../ui/reporte-filtros/reporte-filtros.component';
import { SignalrStatusBadgeComponent } from '../ui/signalr-status-badge/signalr-status-badge.component';
import { TopClientesTableComponent } from '../ui/top-clientes-table/top-clientes-table.component';
import { RetirosCiudadTableComponent } from '../ui/retiros-ciudad-table/retiros-ciudad-table.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { FechaRelativaPipe } from '../../../shared/pipes/fecha-relativa.pipe';

type TabActiva = 'top-clientes' | 'retiros-ciudad';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [
    ReporteFiltrosComponent,
    SignalrStatusBadgeComponent,
    TopClientesTableComponent,
    RetirosCiudadTableComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    FechaRelativaPipe
  ],
  templateUrl: './reportes.page.html',
  styleUrl: './reportes.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportesPage implements OnInit {
  protected readonly service = inject(ReporteService);
  protected readonly tabActiva = signal<TabActiva>('top-clientes');
  private filtrosActuales: FiltrosReporte = {
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    top: 10
  };

  ngOnInit(): void {
    this.service.iniciarSignalR();
    this.service.cargarTopClientes(this.filtrosActuales);
    this.service.cargarRetirosFueraCiudad(this.filtrosActuales);
  }

  protected onFiltrosChanged(filtros: FiltrosReporte): void {
    this.filtrosActuales = {
      ...filtros,
      top: filtros.top ?? this.filtrosActuales.top ?? 10
    };
    this.service.cargarTopClientes(this.filtrosActuales);
    if (this.tabActiva() === 'retiros-ciudad') {
      this.service.cargarRetirosFueraCiudad(this.filtrosActuales);
    }
  }

  protected onTabCambio(tab: TabActiva): void {
    this.tabActiva.set(tab);
    if (tab === 'retiros-ciudad') {
      this.service.cargarRetirosFueraCiudad(this.filtrosActuales);
    }
  }
}
