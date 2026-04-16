import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ProblemDetails } from '../models/problem-details.model';
import { NotificacionService } from '../services/notificacion.service';

function primerErrorDeValidacion(error: ProblemDetails): string | null {
  if (!error.errors) {
    return null;
  }

  const firstKey = Object.keys(error.errors)[0];
  if (!firstKey || !error.errors[firstKey] || error.errors[firstKey].length === 0) {
    return null;
  }

  return error.errors[firstKey][0] ?? null;
}

function mensajePorCodigo(error: ProblemDetails): string | null {
  switch (error.code) {
    case 'INVALID_AMOUNT':
      return error.message ?? 'El monto ingresado no es valido.';
    case 'INVALID_REQUEST':
      return error.message ?? 'La solicitud contiene datos invalidos.';
    case 'ACCOUNT_NOT_FOUND':
      return error.message ?? 'La cuenta solicitada no existe.';
    case 'DUPLICATE_ACCOUNT_NUMBER':
      return error.message ?? 'El numero de cuenta ya esta registrado.';
    case 'DUPLICATE_EMAIL':
      return error.message ?? 'El correo ya esta registrado.';
    case 'INSUFFICIENT_BALANCE':
      return error.message ?? 'Fondos insuficientes para completar el retiro.';
    case 'MINIMUM_WITHDRAWAL_NOT_MET':
      return error.message ?? 'El monto minimo de retiro es de $1.000.000.';
    case 'CONCURRENCY_CONFLICT':
      return error.message ?? 'Se detecto un conflicto de concurrencia. Intenta nuevamente.';
    case 'INTERNAL_ERROR':
      return error.message ?? 'Se presento un error interno del servidor.';
    default:
      return null;
  }
}

function mensajePorEstado(error: ProblemDetails): string {
  const errorDeValidacion = primerErrorDeValidacion(error);
  if (errorDeValidacion) {
    return errorDeValidacion;
  }

  switch (error.status) {
    case 400:
      return error.message ?? error.detail ?? 'Solicitud invalida. Verifica los datos del formulario.';
    case 404:
      return error.message ?? error.detail ?? 'Recurso no encontrado.';
    case 409:
      return error.message ?? error.detail ?? 'Conflicto detectado. Intenta nuevamente.';
    case 422:
      return (
        error.message ?? error.detail ?? 'No se puede completar la operacion por una regla de negocio.'
      );
    case 500:
      return 'Error interno del servidor. Si persiste, contacta soporte.';
    default:
      return error.message ?? error.detail ?? error.title ?? 'Error inesperado en la operacion.';
  }
}

function construirMensaje(error: ProblemDetails): string {
  const porCodigo = mensajePorCodigo(error);
  if (porCodigo) {
    return porCodigo;
  }

  return mensajePorEstado(error);
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificacion = inject(NotificacionService);

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

      if (!payload.status) {
        payload.status = err.status;
      }

      if (payload.status >= 400) {
        const mensaje = construirMensaje(payload);
        const detalle = payload.suggestedAction ?? undefined;
        notificacion.mostrarError(mensaje, detalle);
      }

      return throwError(() => err);
    })
  );
};
