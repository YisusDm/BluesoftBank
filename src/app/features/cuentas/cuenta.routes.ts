import { Routes } from '@angular/router';

export const cuentaRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./cuentas-list.page/cuentas-list.page').then((m) => m.CuentasListPage)
  },
  {
    path: ':id/extracto',
    loadComponent: () =>
      import('./extracto.page/extracto.page').then((m) => m.ExtractoPage)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./cuenta-detail.page/cuenta-detail.page').then((m) => m.CuentaDetailPage)
  }
];
