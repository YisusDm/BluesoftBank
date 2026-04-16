import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cuentas'
  },
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard-shell/dashboard-shell.component').then(
        (m) => m.DashboardShellComponent
      ),
    children: [
      {
        path: 'cuentas',
        loadChildren: () =>
          import('./features/cuentas/cuenta.routes').then((m) => m.cuentaRoutes)
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./features/reportes/reporte.routes').then((m) => m.reporteRoutes)
      }
    ]
  },
  {
    path: 'no-encontrada',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then((m) => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: 'no-encontrada'
  }
];
