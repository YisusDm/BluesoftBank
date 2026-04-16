import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificacionService } from '../../../core/services/notificacion.service';

@Component({
  selector: 'app-alerta',
  template: `
    <section class="alerts" aria-live="assertive" aria-atomic="false">
      @for (alerta of notificacionService.mensajes(); track alerta.id) {
        <article class="alert-item" [class]="'alert-item alert-' + alerta.type" role="alert">
          <span>{{ alerta.mensaje }}</span>
          <button
            type="button"
            class="close-button"
            aria-label="Cerrar alerta"
            (click)="notificacionService.cerrar(alerta.id)"
          >
            x
          </button>
        </article>
      }
    </section>
  `,
  styles: [
    `
      .alerts {
        position: fixed;
        right: 1rem;
        top: 1rem;
        z-index: 1300;
        display: grid;
        gap: 0.6rem;
        width: min(22rem, calc(100vw - 2rem));
      }

      .alert-item {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.75rem 0.85rem;
        border-radius: 0.6rem;
        border: 1px solid transparent;
        background: #f8fafc;
        color: #07203f;
      }

      .alert-success {
        border-color: #7ac7a1;
        background: #e8f7ef;
      }

      .alert-error {
        border-color: #f49a9a;
        background: #fdecec;
      }

      .alert-warning {
        border-color: #e8c97b;
        background: #fff7df;
      }

      .alert-info {
        border-color: #9ec3f3;
        background: #eaf3ff;
      }

      .close-button {
        border: 0;
        background: transparent;
        color: currentcolor;
        font-size: 1rem;
        cursor: pointer;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertaComponent {
  protected readonly notificacionService = inject(NotificacionService);
}
