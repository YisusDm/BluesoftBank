import { ChangeDetectionStrategy, Component, OnInit, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FiltrosReporte } from '../../data-access/reporte.models';

@Component({
  selector: 'app-reporte-filtros',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reporte-filtros.component.html',
  styleUrl: './reporte-filtros.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporteFiltrosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  filtrosChanged = output<FiltrosReporte>();

  protected readonly meses = [
    { valor: 1, nombre: 'Enero' }, { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' }, { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' }, { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' }, { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' }, { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' }, { valor: 12, nombre: 'Diciembre' }
  ];

  private readonly ahora = new Date();
  protected readonly anios = [
    this.ahora.getFullYear(), this.ahora.getFullYear() - 1, this.ahora.getFullYear() - 2
  ];

  readonly form = this.fb.nonNullable.group({
    mes: [this.ahora.getMonth() + 1, [Validators.required]],
    anio: [this.ahora.getFullYear(), [Validators.required]],
    top: [10, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  ngOnInit(): void {
    this.emitir();
  }

  protected onAplicar(): void {
    if (this.form.invalid) return;
    this.emitir();
  }

  private emitir(): void {
    this.filtrosChanged.emit(this.form.getRawValue());
  }
}
