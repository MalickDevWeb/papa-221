import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/core/firebase/firebase';
import { Notification } from '../../domain/Notification';
import { NotificationRepository } from '../../domain/NotificationRepository';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export class FirebaseNotificationRepository implements NotificationRepository {
  async sendNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    const path = 'notifications';
    try {
      await addDoc(collection(db, path), {
        ...notification,
        createdAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  subscribeToNotifications(onUpdate: (notifications: Notification[]) => void): () => void {
    const path = 'notifications';
    const q = query(
      collection(db, path),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notifs.push({
          id: doc.id,
          title: data.title || '',
          desc: data.desc || '',
          time: data.time || "À l'instant",
          read: data.read ?? false,
          icon: data.icon || 'notifications',
          color: data.color || 'text-[#B3181C] bg-red-50',
          createdAt: data.createdAt || Date.now(),
        });
      });
      onUpdate(notifs);
    }, (error) => {
      // Handle permission/insufficient permission or other connection/auth errors gracefully without crashing the app.
      // Since rules might not be fully deployed or the user might be unauthenticated,
      // we log a warning and fallback rather than throwing a fatal error.
      const isPermissionError = error instanceof Error && 
        (error.message.includes('permission') || error.message.includes('Permission') || error.message.includes('insufficient'));
      
      if (isPermissionError) {
        console.warn('Firestore notification subscription is inactive (permissions/setup pending). Falling back to offline/local storage notifications.');
      } else {
        console.warn('Firestore notification error:', error);
      }
    });
  }
}
