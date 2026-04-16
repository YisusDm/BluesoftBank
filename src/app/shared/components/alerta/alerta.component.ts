import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificacionService } from '../../../core/services/notificacion.service';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertaComponent {
  protected readonly notificacionService = inject(NotificacionService);
}
