import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RetirarRequest } from '../../data-access/cuenta.models';
import { CurrencyColombianPipe } from '../../../../shared/pipes/currency-colombian.pipe';
import { CopCurrencyInputDirective } from '../../../../shared/directives/cop-currency-input.directive';

@Component({
  selector: 'app-retirar-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyColombianPipe, CopCurrencyInputDirective],
  templateUrl: './retirar-form.component.html',
  styleUrl: './retirar-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetirarFormComponent {
  private readonly fb = inject(FormBuilder);

  enviando = input<boolean>(false);
  saldoActual = input<number>(0);
  retirar = output<RetirarRequest>();
  cancelar = output<void>();
  readonly MONTO_MINIMO = 1_000_000;

  readonly form = this.fb.nonNullable.group({
    monto: [0, [Validators.required, Validators.min(this.MONTO_MINIMO)]],
    ciudad: ['', [Validators.required, Validators.minLength(2)]]
  });

  get montoInvalido(): boolean {
    const c = this.form.controls.monto;
    return c.invalid && c.touched;
  }

  get ciudadInvalida(): boolean {
    const c = this.form.controls.ciudad;
    return c.invalid && c.touched;
  }

  get saldoInsuficiente(): boolean {
    const monto = this.form.controls.monto.value;
    return monto > 0 && monto > this.saldoActual();
  }

  onSubmit(): void {
    if (this.enviando()) return;

    this.form.markAllAsTouched();
    if (this.form.invalid || this.saldoInsuficiente) return;
    this.retirar.emit(this.form.getRawValue());
  }
}
