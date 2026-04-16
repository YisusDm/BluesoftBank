import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { CargaService } from '../services/carga.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const cargaService = inject(CargaService);

  cargaService.mostrarCarga();

  return next(req).pipe(finalize(() => cargaService.ocultarCarga()));
};
