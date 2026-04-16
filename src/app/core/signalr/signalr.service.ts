import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export type SignalREstado = 'conectado' | 'reconectando' | 'desconectado';

@Injectable({ providedIn: 'root' })
export class SignalRService implements OnDestroy {
  private hubConnection: signalR.HubConnection | null = null;
  private readonly subjects = new Map<string, Subject<unknown>>();

  private readonly _estado = signal<SignalREstado>('desconectado');
  readonly estado = this._estado.asReadonly();

  iniciar(): void {
    if (this.hubConnection) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalrUrl, {
        withCredentials: false,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (ctx) => {
          const delays = [1000, 2000, 5000, 10000, 30000];
          return delays[Math.min(ctx.previousRetryCount, delays.length - 1)];
        }
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.hubConnection.onreconnecting(() => this._estado.set('reconectando'));
    this.hubConnection.onreconnected(() => this._estado.set('conectado'));
    this.hubConnection.onclose(() => this._estado.set('desconectado'));

    this.hubConnection
      .start()
      .then(() => this._estado.set('conectado'))
      .catch(() => this._estado.set('desconectado'));
  }

  on<T>(evento: string): Observable<T> {
    if (!this.subjects.has(evento)) {
      const subject = new Subject<unknown>();
      this.subjects.set(evento, subject);
      this.hubConnection?.on(evento, (data: unknown) => subject.next(data));
    }
    return this.subjects.get(evento)!.asObservable() as Observable<T>;
  }

  ngOnDestroy(): void {
    this.subjects.forEach((s) => s.complete());
    this.subjects.clear();
    this.hubConnection?.stop();
  }
}
