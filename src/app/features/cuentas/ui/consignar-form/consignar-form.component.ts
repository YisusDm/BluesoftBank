import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ConsignarRequest } from '../../data-access/cuenta.models';
import { CopCurrencyInputDirective } from '../../../../shared/directives/cop-currency-input.directive';

@Component({
  selector: 'app-consignar-form',
  standalone: true,
  imports: [ReactiveFormsModule, CopCurrencyInputDirective],
  templateUrl: './consignar-form.component.html',
  styleUrl: './consignar-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsignarFormComponent {
  private readonly fb = inject(FormBuilder);

  enviando = input<boolean>(false);
  consignar = output<ConsignarRequest>();
  cancelar = output<void>();

  readonly form = this.fb.nonNullable.group({
    monto: [0, [Validators.required, Validators.min(1)]],
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

  onSubmit(): void {
    if (this.enviando()) return;

    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.consignar.emit(this.form.getRawValue());
  }
}
