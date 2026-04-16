import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-implemented',
  imports: [RouterLink],
  templateUrl: './not-implemented.component.html',
  styleUrl: './not-implemented.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotImplementedComponent {
  private readonly route = inject(ActivatedRoute);

  readonly featureName = (this.route.snapshot.data['featureName'] as string | undefined) ?? 'Modulo';
}
