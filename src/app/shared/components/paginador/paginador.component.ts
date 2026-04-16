import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginador',
  standalone: true,
  templateUrl: './paginador.component.html',
  styleUrl: './paginador.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginadorComponent {
  paginaActual = input.required<number>();
  totalRegistros = input.required<number>();
  tamano = input<number>(10);

  paginaCambiada = output<number>();

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.totalRegistros() / this.tamano()))
  );

  protected readonly tienePrevio = computed(() => this.paginaActual() > 1);
  protected readonly tieneSiguiente = computed(() => this.paginaActual() < this.totalPaginas());

  protected readonly paginas = computed(() => {
    const total = this.totalPaginas();
    const actual = this.paginaActual();
    const rango = 2;
    const inicio = Math.max(1, actual - rango);
    const fin = Math.min(total, actual + rango);
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  });

  ir(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) return;
    this.paginaCambiada.emit(pagina);
  }
}
