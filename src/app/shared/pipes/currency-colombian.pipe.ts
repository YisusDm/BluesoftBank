import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyColombian', standalone: true, pure: true })
export class CurrencyColombianPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value == null || value === '') return '—';

    const numericValue = typeof value === 'string' ? Number(value) : value;
    if (!Number.isFinite(numericValue)) return '—';

    return numericValue.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}
