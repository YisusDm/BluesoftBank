import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CrearCuentaAhorroRequest } from '../../data-access/cuenta.models';

@Component({
  selector: 'app-crear-cuenta-ahorro-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crear-cuenta-ahorro-form.component.html',
  styleUrl: './crear-cuenta-ahorro-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearCuentaAhorroFormComponent {
  private readonly fb = inject(FormBuilder);

  crear = output<CrearCuentaAhorroRequest>();
  cancelar = output<void>();

  readonly form = this.fb.nonNullable.group({
    numeroCuenta: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    ciudad: ['', [Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    correo: ['', [Validators.required, Validators.email]],
    ciudadCliente: ['', [Validators.required]],
    cedula: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
  });

  campo(name: keyof typeof this.form.controls) {
    return this.form.controls[name];
  }

  invalido(name: keyof typeof this.form.controls): boolean {
    const c = this.campo(name);
    return c.invalid && c.touched;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.crear.emit(this.form.getRawValue());
  }
}
