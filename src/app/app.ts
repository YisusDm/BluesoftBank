import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertaComponent } from './shared/components/alerta/alerta.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
