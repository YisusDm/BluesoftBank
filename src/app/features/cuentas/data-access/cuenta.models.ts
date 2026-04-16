export enum TipoTransaccion {
  Consignacion = 'Consignacion',
  Retiro = 'Retiro'
}

export interface CuentaDto {
  id: string;
  numeroCuenta: string;
  tipoCuenta: 'CuentaAhorro' | 'CuentaCorriente';
  saldo: number;
  ciudad: string;
  clienteNombre: string;
  clienteId: string;
  correoCliente?: string;
  ciudadCliente?: string;
}

export interface TransaccionDto {
  id: string;
  tipo: TipoTransaccion;
  monto: number;
  saldoResultante: number;
  ciudad: string;
  esFueraDeCiudadOrigen: boolean;
  fecha: string;
}

export interface ExtractoDto {
  cuentaId: string;
  numeroCuenta: string;
  periodo: string;
  saldoInicial: number;
  saldoFinal: number;
  totalConsignaciones: number;
  totalRetiros: number;
  movimientos: TransaccionDto[];
}

export interface CuentasPagedResponse {
  cuentas: CuentaDto[];
  totalRegistros: number;
  pagina: number;
  tamano: number;
}

export interface MovimientosPagedResponse {
  movimientos: TransaccionDto[];
  totalRegistros: number;
  pagina: number;
  tamano: number;
}

export interface ConsignarRequest {
  monto: number;
  ciudad: string;
}

export interface RetirarRequest {
  monto: number;
  ciudad: string;
}

export interface TransaccionResponse {
  cuentaId: string;
  nuevoSaldo: number;
  transaccionId: string;
  esFueraDeCiudadOrigen: boolean;
  fecha: string;
}

export interface CrearCuentaAhorroRequest {
  numeroCuenta: string;
  ciudad: string;
  nombre: string;
  correo: string;
  ciudadCliente: string;
  cedula: string;
}

export interface CrearCuentaCorrienteRequest {
  numeroCuenta: string;
  ciudad: string;
  nombre: string;
  correo: string;
  ciudadCliente: string;
  nit: string;
  cupoSobregiro: number;
}

export interface CuentaCreatedResponse {
  cuentaId: string;
  numeroCuenta: string;
  clienteId: string;
  nombreCliente: string;
}
