import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="not-found">
      <h1 class="not-found__codigo">404</h1>
      <p class="not-found__mensaje">No encontramos la pagina solicitada.</p>
      <a routerLink="/cuentas" class="not-found__link">← Ir a Cuentas</a>
    </main>
  `,
  styles: [`
    .not-found {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      text-align: center;
      padding: 2rem;
    }
    .not-found__icono { font-size: 3.5rem; }
    .not-found__codigo { margin: 0; font-size: 4rem; font-weight: 700; color: var(--color-primary); }
    .not-found__mensaje { margin: 0; color: #6b7a99; font-size: 1rem; }
    .not-found__link { color: var(--color-primary); font-weight: 600; text-decoration: none; }
    .not-found__link:hover { text-decoration: underline; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
