import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProblemDetails } from '../../../core/models/problem-details.model';
import { Result } from '../../../core/models/result.model';
import {
  ConsignarRequest,
  CuentaCreatedResponse,
  CuentaDto,
  CuentasPagedResponse,
  CrearCuentaAhorroRequest,
  CrearCuentaCorrienteRequest,
  ExtractoDto,
  MovimientosPagedResponse,
  RetirarRequest,
  TipoTransaccion,
  TransaccionDto,
  TransaccionResponse
} from './cuenta.models';

type CuentaApiRaw = Partial<CuentaDto> & {
  cuentaId?: string;
  cliente?: {
    clienteId?: string;
    nombre?: string;
    correo?: string;
    ciudad?: string;
  };
};

type TransaccionApiRaw = Partial<TransaccionDto> & {
  fechaHora?: string;
};

type ExtractoApiRaw = Partial<ExtractoDto> & {
  transacciones?: TransaccionApiRaw[];
  movimientos?: TransaccionApiRaw[];
};

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/cuentas`;

  private readonly _cuentas = signal<CuentaDto[]>([]);
  private readonly _cuenta = signal<CuentaDto | null>(null);
  private readonly _movimientos = signal<MovimientosPagedResponse | null>(null);
  private readonly _extracto = signal<ExtractoDto | null>(null);
  private readonly _totalRegistros = signal(0);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly cuentas = this._cuentas.asReadonly();
  readonly cuenta = this._cuenta.asReadonly();
  readonly movimientos = this._movimientos.asReadonly();
  readonly extracto = this._extracto.asReadonly();
  readonly totalRegistros = this._totalRegistros.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly saldoFormateado = computed(() => {
    const saldo = this._cuenta()?.saldo;
    if (saldo == null) return '—';
    return saldo.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  });

  cargarCuentas(pagina = 1, tamano = 10): void {
    this._loading.set(true);
    this._error.set(null);
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamano', tamano.toString());

    this.http
      .get<CuentasPagedResponse>(this.base, { params })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._cuentas.set((res.cuentas ?? []).map((item) => this.mapCuenta(item as CuentaApiRaw)));
          this._totalRegistros.set(res.totalRegistros);
        },
        error: (err) => this._error.set(this.extraerMensajeError(err))
      });
  }

  cargarCuenta(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.http
      .get<CuentaDto>(`${this.base}/${id}`)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (cuenta) => this._cuenta.set(this.mapCuenta(cuenta as CuentaApiRaw)),
        error: (err) => this._error.set(this.extraerMensajeError(err))
      });
  }

  cargarMovimientos(id: string, pagina = 1, tamano = 10): void {
    this._loading.set(true);
    this._error.set(null);
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamano', tamano.toString());

    this.http
      .get<MovimientosPagedResponse>(`${this.base}/${id}/movimientos`, { params })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) =>
          this._movimientos.set({
            ...res,
            movimientos: (res.movimientos ?? []).map((item) =>
              this.mapTransaccion(item as TransaccionApiRaw)
            )
          }),
        error: (err) => this._error.set(this.extraerMensajeError(err))
      });
  }

  cargarExtracto(id: string, mes: number, anio: number): void {
    this._loading.set(true);
    this._error.set(null);
    const params = new HttpParams()
      .set('mes', mes.toString())
      .set('anio', anio.toString());

    this.http
      .get<ExtractoApiRaw>(`${this.base}/${id}/extracto`, { params })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (extracto) => this._extracto.set(this.mapExtracto(extracto)),
        error: (err) => this._error.set(this.extraerMensajeError(err))
      });
  }

  consignar(id: string, req: ConsignarRequest): Observable<Result<TransaccionResponse>> {
    return this.http
      .post<TransaccionResponse>(`${this.base}/${id}/consignar`, req)
      .pipe(
        tap((res) => {
          this._cuenta.update((c) => (c ? { ...c, saldo: res.nuevoSaldo } : c));
        })
      )
      .pipe(
        finalize(() => {}),
        (src) =>
          new Observable<Result<TransaccionResponse>>((obs) => {
            src.subscribe({
              next: (v) => obs.next({ isSuccess: true, value: v }),
              error: (e) =>
                obs.next({ isSuccess: false, error: this.extraerMensajeError(e, 'Error desconocido') }),
              complete: () => obs.complete()
            });
          })
      );
  }

  retirar(id: string, req: RetirarRequest): Observable<Result<TransaccionResponse>> {
    return this.http
      .post<TransaccionResponse>(`${this.base}/${id}/retirar`, req)
      .pipe(
        tap((res) => {
          this._cuenta.update((c) => (c ? { ...c, saldo: res.nuevoSaldo } : c));
        })
      )
      .pipe(
        finalize(() => {}),
        (src) =>
          new Observable<Result<TransaccionResponse>>((obs) => {
            src.subscribe({
              next: (v) => obs.next({ isSuccess: true, value: v }),
              error: (e) =>
                obs.next({ isSuccess: false, error: this.extraerMensajeError(e, 'Error desconocido') }),
              complete: () => obs.complete()
            });
          })
      );
  }

  crearCuentaAhorro(req: CrearCuentaAhorroRequest): Observable<Result<CuentaCreatedResponse>> {
    return this.http
      .post<CuentaCreatedResponse>(`${this.base}/ahorro`, req)
      .pipe(
        (src) =>
          new Observable<Result<CuentaCreatedResponse>>((obs) => {
            src.subscribe({
              next: (v) => obs.next({ isSuccess: true, value: v }),
              error: (e) =>
                obs.next({ isSuccess: false, error: this.extraerMensajeError(e, 'Error desconocido') }),
              complete: () => obs.complete()
            });
          })
      );
  }

  crearCuentaCorriente(
    req: CrearCuentaCorrienteRequest
  ): Observable<Result<CuentaCreatedResponse>> {
    return this.http
      .post<CuentaCreatedResponse>(`${this.base}/corriente`, req)
      .pipe(
        (src) =>
          new Observable<Result<CuentaCreatedResponse>>((obs) => {
            src.subscribe({
              next: (v) => obs.next({ isSuccess: true, value: v }),
              error: (e) =>
                obs.next({ isSuccess: false, error: this.extraerMensajeError(e, 'Error desconocido') }),
              complete: () => obs.complete()
            });
          })
      );
  }

  limpiarCuenta(): void {
    this._cuenta.set(null);
    this._movimientos.set(null);
    this._extracto.set(null);
    this._error.set(null);
  }

  private mapCuenta(raw: CuentaApiRaw): CuentaDto {
    const saldo = Number(raw.saldo ?? (raw as { saldoActual?: number | string }).saldoActual ?? 0);

    return {
      id: raw.cuentaId ?? raw.id ?? '',
      numeroCuenta: raw.numeroCuenta ?? '',
      tipoCuenta: raw.tipoCuenta ?? 'CuentaAhorro',
      saldo: Number.isFinite(saldo) ? saldo : 0,
      ciudad: raw.ciudad ?? raw.cliente?.ciudad ?? '',
      fechaCreacion: raw.fechaCreacion,
      clienteNombre: raw.clienteNombre ?? raw.cliente?.nombre ?? 'Cliente',
      clienteId: raw.clienteId ?? raw.cliente?.clienteId ?? '',
      correoCliente: raw.correoCliente ?? raw.cliente?.correo,
      ciudadCliente: raw.ciudadCliente ?? raw.cliente?.ciudad
    };
  }

  private mapTransaccion(raw: TransaccionApiRaw): TransaccionDto {
    return {
      id: raw.id ?? '',
      tipo: raw.tipo ?? TipoTransaccion.Consignacion,
      monto: raw.monto ?? 0,
      saldoResultante: raw.saldoResultante ?? 0,
      ciudad: raw.ciudad ?? '',
      esFueraDeCiudadOrigen: raw.esFueraDeCiudadOrigen ?? false,
      fecha: raw.fecha ?? raw.fechaHora ?? ''
    };
  }

  private mapExtracto(raw: ExtractoApiRaw): ExtractoDto {
    const movimientos = (raw.movimientos ?? raw.transacciones ?? []).map((item) =>
      this.mapTransaccion(item)
    );

    return {
      cuentaId: raw.cuentaId ?? '',
      numeroCuenta: raw.numeroCuenta ?? '',
      periodo: raw.periodo ?? '',
      saldoInicial: raw.saldoInicial ?? 0,
      saldoFinal: raw.saldoFinal ?? 0,
      totalConsignaciones: raw.totalConsignaciones ?? 0,
      totalRetiros: raw.totalRetiros ?? 0,
      movimientos
    };
  }

  private extraerMensajeError(error: unknown, fallback = 'Error inesperado en la operacion.'): string {
    if (error instanceof HttpErrorResponse) {
      const payload = error.error as ProblemDetails | string | undefined;

      if (typeof payload === 'string' && payload.trim().length > 0) {
        return payload;
      }

      if (payload && typeof payload === 'object') {
        if (payload.message) {
          return payload.message;
        }
        if (payload.detail) {
          return payload.detail;
        }
        if (payload.title) {
          return payload.title;
        }
      }

      if (error.message) {
        return error.message;
      }

      return fallback;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message?: unknown }).message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }

    return fallback;
  }
}
