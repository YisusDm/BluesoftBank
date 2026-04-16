import { Routes } from '@angular/router';

export const reporteRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./reportes.page/reportes.page').then((m) => m.ReportesPage)
  }
];
