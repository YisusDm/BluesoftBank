export interface TopClienteDto {
  clienteId: string;
  nombre: string;
  totalTransacciones: number;
  totalConsignaciones: number;
  totalRetiros: number;
}

export interface RetiroFueraCiudadDto {
  clienteId: string;
  nombre: string;
  ciudadOrigen: string;
  totalRetirosFueraCiudad: number;
  valorTotalRetiros: number;
  ultimoRetiro?: string;
}

export interface FiltrosReporte {
  mes: number;
  anio: number;
  top?: number;
}
