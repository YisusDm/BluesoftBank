import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tipoTransaccion', standalone: true, pure: true })
export class TipoTransaccionPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    switch (value) {
      case 'Consignacion':
        return '↓ Consignacion';
      case 'Retiro':
        return '↑ Retiro';
      default:
        return value ?? '—';
    }
  }
}
