import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ExtractoDto } from '../../data-access/cuenta.models';
import { CurrencyColombianPipe } from '../../../../shared/pipes/currency-colombian.pipe';

@Component({
  selector: 'app-extracto-summary',
  standalone: true,
  imports: [CurrencyColombianPipe],
  templateUrl: './extracto-summary.component.html',
  styleUrl: './extracto-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtractoSummaryComponent {
  extracto = input.required<ExtractoDto>();

  protected readonly tituloPeriodo = computed(() => this.extracto().periodo || 'Periodo');
}
