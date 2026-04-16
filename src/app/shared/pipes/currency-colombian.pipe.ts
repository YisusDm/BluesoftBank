import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyColombian', standalone: true, pure: true })
export class CurrencyColombianPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '—';
    return value.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}
