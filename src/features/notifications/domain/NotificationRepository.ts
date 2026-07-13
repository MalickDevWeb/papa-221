import { Notification } from './Notification';

export interface NotificationRepository {
  sendNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void>;
  subscribeToNotifications(onUpdate: (notifications: Notification[]) => void): () => void;
}
