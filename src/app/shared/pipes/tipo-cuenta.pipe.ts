import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tipoCuenta', standalone: true, pure: true })
export class TipoCuentaPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    switch (value) {
      case 'CuentaAhorro':
        return 'Ahorro';
      case 'CuentaCorriente':
        return 'Corriente';
      default:
        return value ?? '—';
    }
  }
}
