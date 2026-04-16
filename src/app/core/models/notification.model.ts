export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationMessage {
  id: string;
  type: NotificationType;
  mensaje: string;
  createdAt: number;
  durationMs: number;
}
