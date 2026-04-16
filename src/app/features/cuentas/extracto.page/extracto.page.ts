import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CuentaService } from '../data-access/cuenta.service';
import { ExtractoSummaryComponent } from '../ui/extracto-summary/extracto-summary.component';
import { ExtractoTableComponent } from '../ui/extracto-table/extracto-table.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-extracto-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ExtractoSummaryComponent,
    ExtractoTableComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    EmptyStateComponent
  ],
  templateUrl: './extracto.page.html',
  styleUrl: './extracto.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtractoPage implements OnInit {
  protected readonly service = inject(CuentaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly meses = [
    { valor: 1, nombre: 'Enero' }, { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' }, { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' }, { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' }, { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' }, { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' }, { valor: 12, nombre: 'Diciembre' }
  ];

  protected readonly anios = signal<number[]>([]);

  private get cuentaId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  private readonly ahora = new Date();

  readonly form = this.fb.nonNullable.group({
    mes: [this.ahora.getMonth() + 1, [Validators.required]],
    anio: [this.ahora.getFullYear(), [Validators.required]]
  });

  ngOnInit(): void {
    const anioActual = this.ahora.getFullYear();
    this.anios.set([anioActual, anioActual - 1, anioActual - 2]);
    this.cargar();
  }

  private cargar(): void {
    const { mes, anio } = this.form.getRawValue();
    this.service.cargarExtracto(this.cuentaId, mes, anio);
  }

  protected onConsultar(): void {
    if (this.form.invalid) return;
    this.cargar();
  }

  protected onVolver(): void {
    this.router.navigate(['/cuentas', this.cuentaId]);
  }
}
