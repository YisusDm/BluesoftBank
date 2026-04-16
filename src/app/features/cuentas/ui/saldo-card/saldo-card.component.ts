import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-saldo-card',
  standalone: true,
  templateUrl: './saldo-card.component.html',
  styleUrl: './saldo-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaldoCardComponent {
  saldo = input.required<string>();
}
