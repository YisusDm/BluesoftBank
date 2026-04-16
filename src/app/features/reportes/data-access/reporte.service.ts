import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SignalRService } from '../../../core/signalr/signalr.service';
import { FiltrosReporte, RetiroFueraCiudadDto, TopClienteDto } from './reporte.models';

type TopClienteRaw = Partial<TopClienteDto> & {
  clienteNombre?: string;
  numeroTransacciones?: number;
};

type RetiroFueraCiudadRaw = Partial<RetiroFueraCiudadDto> & {
  clienteNombre?: string;
  ciudadCuenta?: string;
  totalRetiros?: number;
  numeroOperaciones?: number;
};

@Injectable({ providedIn: 'root' })
export class ReporteService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly signalr = inject(SignalRService);
  private readonly base = `${environment.apiUrl}/reportes`;

  private readonly _topClientes = signal<TopClienteDto[]>([]);
  private readonly _retirosFueraCiudad = signal<RetiroFueraCiudadDto[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _ultimaActualizacion = signal<Date | null>(null);

  readonly topClientes = this._topClientes.asReadonly();
  readonly retirosFueraCiudad = this._retirosFueraCiudad.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly ultimaActualizacion = this._ultimaActualizacion.asReadonly();
  readonly estadoSignalR = this.signalr.estado;

  private readonly subs: Subscription[] = [];

  iniciarSignalR(): void {
    this.signalr.iniciar();

    this.subs.push(
      this.signalr.on<TopClienteDto[]>('TopClientesActualizado').subscribe((datos) => {
        this._topClientes.set((datos ?? []).map((d) => this.mapTopCliente(d as TopClienteRaw)));
        this._ultimaActualizacion.set(new Date());
      })
    );

    this.subs.push(
      this.signalr.on<RetiroFueraCiudadDto[]>('RetirosFueraCiudadActualizado').subscribe((datos) => {
        this._retirosFueraCiudad.set(
          (datos ?? []).map((d) => this.mapRetiroFueraCiudad(d as RetiroFueraCiudadRaw))
        );
        this._ultimaActualizacion.set(new Date());
      })
    );
  }

  cargarTopClientes(filtros: FiltrosReporte): void {
    this._loading.set(true);
    this._error.set(null);
    const params = new HttpParams()
      .set('mes', filtros.mes.toString())
      .set('anio', filtros.anio.toString())
      .set('top', (filtros.top ?? 10).toString());

    this.http
      .get<TopClienteRaw[]>(`${this.base}/top-clientes`, { params })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (data) => {
          this._topClientes.set((data ?? []).map((d) => this.mapTopCliente(d)));
          this._ultimaActualizacion.set(new Date());
        },
        error: (err) => this._error.set(err.message)
      });
  }

  cargarRetirosFueraCiudad(filtros?: FiltrosReporte): void {
    this._loading.set(true);
    this._error.set(null);

    let params = new HttpParams();
    if (filtros) {
      params = params.set('mes', filtros.mes.toString()).set('anio', filtros.anio.toString());
    }

    this.http
      .get<RetiroFueraCiudadRaw[]>(`${this.base}/retiros-fuera-ciudad`, { params })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (data) => {
          this._retirosFueraCiudad.set((data ?? []).map((d) => this.mapRetiroFueraCiudad(d)));
          this._ultimaActualizacion.set(new Date());
        },
        error: (err) => this._error.set(err.message)
      });
  }

  private mapTopCliente(raw: TopClienteRaw): TopClienteDto {
    return {
      clienteId: raw.clienteId ?? '',
      nombre: raw.nombre ?? raw.clienteNombre ?? 'Sin nombre',
      totalTransacciones: raw.totalTransacciones ?? raw.numeroTransacciones ?? 0,
      totalConsignaciones: raw.totalConsignaciones ?? 0,
      totalRetiros: raw.totalRetiros ?? 0
    };
  }

  private mapRetiroFueraCiudad(raw: RetiroFueraCiudadRaw): RetiroFueraCiudadDto {
    return {
      clienteId: raw.clienteId ?? '',
      nombre: raw.nombre ?? raw.clienteNombre ?? 'Sin nombre',
      ciudadOrigen: raw.ciudadOrigen ?? raw.ciudadCuenta ?? '',
      totalRetirosFueraCiudad: raw.totalRetirosFueraCiudad ?? raw.numeroOperaciones ?? 0,
      valorTotalRetiros: raw.valorTotalRetiros ?? raw.totalRetiros ?? 0,
      ultimoRetiro: raw.ultimoRetiro
    };
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
