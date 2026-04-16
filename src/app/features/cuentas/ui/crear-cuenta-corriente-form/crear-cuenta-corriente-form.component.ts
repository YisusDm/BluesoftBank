import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CrearCuentaCorrienteRequest } from '../../data-access/cuenta.models';

@Component({
  selector: 'app-crear-cuenta-corriente-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crear-cuenta-corriente-form.component.html',
  styleUrl: './crear-cuenta-corriente-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearCuentaCorrienteFormComponent {
  private readonly fb = inject(FormBuilder);

  crear = output<CrearCuentaCorrienteRequest>();
  cancelar = output<void>();

  readonly form = this.fb.nonNullable.group({
    numeroCuenta: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    ciudad: ['', [Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    correo: ['', [Validators.required, Validators.email]],
    ciudadCliente: ['', [Validators.required]],
    nit: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    cupoSobregiro: [0, [Validators.required, Validators.min(1)]]
  });

  invalido(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.crear.emit(this.form.getRawValue());
  }
}
