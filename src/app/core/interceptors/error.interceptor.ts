import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ProblemDetails } from '../models/problem-details.model';
import { NotificacionService } from '../services/notificacion.service';

function mensajePorEstado(error: ProblemDetails): string {
  switch (error.status) {
    case 400:
      return error.detail ?? 'Solicitud invalida. Verifica los datos del formulario.';
    case 404:
      return error.detail ?? 'Recurso no encontrado.';
    case 409:
      return error.detail ?? 'Conflicto detectado. Intenta nuevamente.';
    case 422:
      return error.detail ?? 'No se puede completar la operacion por una regla de negocio.';
    case 500:
      return 'Error interno del servidor. Si persiste, contacta soporte.';
    default:
      return error.detail ?? error.title ?? 'Error inesperado en la operacion.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificacion = inject(NotificacionService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        notificacion.mostrarError('Error de red no identificado.');
        return throwError(() => err);
      }

      const payload: ProblemDetails = (err.error as ProblemDetails | undefined) ?? {
        status: err.status,
        title: err.statusText
      };

      if (err.status === 404) {
        router.navigate(['/no-encontrada']);
        return throwError(() => err);
      }

      if (payload.status >= 400) {
        notificacion.mostrarError(mensajePorEstado(payload));
      }

      return throwError(() => err);
    })
  );
};
