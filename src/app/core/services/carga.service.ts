import { computed, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class CargaService {
  private readonly activeRequests = signal(0);

  readonly isLoading = computed(() => this.activeRequests() > 0);
  readonly esCargando$ = toObservable(this.isLoading);

  mostrarCarga(): void {
    this.activeRequests.update((value) => value + 1);
  }

  ocultarCarga(): void {
    this.activeRequests.update((value) => Math.max(0, value - 1));
  }
}
