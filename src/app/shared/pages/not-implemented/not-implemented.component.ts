import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-implemented',
  imports: [RouterLink],
  template: `
    <section class="pending">
      <h2>{{ featureName }}</h2>
      <p>Este modulo se encuentra en implementacion.</p>
      <a routerLink="/dashboard/perfil">Ir a perfil</a>
    </section>
  `,
  styles: [
    `
      .pending {
        border: 1px solid #b8caea;
        border-radius: 0.8rem;
        background: #ffffff;
        padding: 1rem;
      }

      h2 {
        margin: 0 0 0.4rem;
        color: #133d7f;
      }

      p {
        margin: 0 0 0.8rem;
        color: #2b4166;
      }

      a {
        color: #0a56b5;
        font-weight: 600;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotImplementedComponent {
  private readonly route = inject(ActivatedRoute);

  readonly featureName = (this.route.snapshot.data['featureName'] as string | undefined) ?? 'Modulo';
}
