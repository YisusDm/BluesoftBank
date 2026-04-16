import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechaRelativa', standalone: true, pure: true })
export class FechaRelativaPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '—';
    const fecha = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(fecha.getTime())) return '—';

    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSeg / 60);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffSeg < 60) return 'hace un momento';
    if (diffMin < 60) return `hace ${diffMin} min`;
    if (diffHoras < 24) return `hace ${diffHoras} h`;
    if (diffDias === 1) return 'ayer';
    if (diffDias < 7) return `hace ${diffDias} dias`;

    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
