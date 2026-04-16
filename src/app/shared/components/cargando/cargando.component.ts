import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CargaService } from '../../../core/services/carga.service';

@Component({
  selector: 'app-cargando',
  imports: [AsyncPipe],
  template: `
    @if (cargando$ | async) {
      <section class="loading-overlay" aria-live="polite" aria-label="Cargando">
        <div class="loading-card">
          <div class="spinner" aria-hidden="true"></div>
          <p>{{ mensaje() }}</p>
        </div>
      </section>
    }
  `,
  styles: [
    `
      .loading-overlay {
        position: fixed;
        inset: 0;
        z-index: 1200;
        display: grid;
        place-items: center;
        background-color: rgba(1, 20, 46, 0.35);
      }

      .loading-card {
        width: min(20rem, 90vw);
        border-radius: 1rem;
        background: #ffffff;
        padding: 1.2rem;
        text-align: center;
        box-shadow: 0 20px 55px rgba(5, 32, 70, 0.28);
      }

      .spinner {
        width: 2.2rem;
        height: 2.2rem;
        margin: 0 auto 0.7rem;
        border: 3px solid #d3e0f5;
        border-top-color: #0a5bc2;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      p {
        margin: 0;
        color: #0f2b52;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CargandoComponent {
  private readonly cargaService = inject(CargaService);

  readonly mensaje = input('Procesando...');
  readonly cargando$ = this.cargaService.esCargando$;
}
