import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SignalREstado } from '../../../../core/signalr/signalr.service';

@Component({
  selector: 'app-signalr-status-badge',
  standalone: true,
  templateUrl: './signalr-status-badge.component.html',
  styleUrl: './signalr-status-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalrStatusBadgeComponent {
  estado = input.required<SignalREstado>();
}
