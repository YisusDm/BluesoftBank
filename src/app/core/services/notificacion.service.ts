import { Injectable, signal } from '@angular/core';
import { NotificationMessage, NotificationType } from '../models/notification.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly messagesSignal = signal<NotificationMessage[]>([]);

  readonly mensajes = this.messagesSignal.asReadonly();

  mostrarExito(mensaje: string): void {
    this.pushMessage('success', mensaje);
  }

  mostrarError(mensaje: string): void {
    this.pushMessage('error', mensaje);
  }

  mostrarAdvertencia(mensaje: string): void {
    this.pushMessage('warning', mensaje);
  }

  mostrarInfo(mensaje: string): void {
    this.pushMessage('info', mensaje);
  }

  cerrar(id: string): void {
    this.messagesSignal.update((messages) => messages.filter((item) => item.id !== id));
  }

  private pushMessage(type: NotificationType, mensaje: string): void {
    const item: NotificationMessage = {
      id: crypto.randomUUID(),
      type,
      mensaje,
      createdAt: Date.now(),
      durationMs: environment.notificacionDuracion
    };

    this.messagesSignal.update((messages) => [...messages, item]);

    setTimeout(() => {
      this.cerrar(item.id);
    }, item.durationMs);
  }
}
