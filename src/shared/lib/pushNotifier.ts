export function requestPushPermission(): void {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch((err) => {
        console.warn('Notification permission request failed', err);
      });
    }
  }
}

export function sendPushNotification(title: string, body: string): void {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          tag: 'school-offline-sync',
          icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135755.png'
        });
      } catch (err) {
        console.warn('Could not trigger native notification', err);
      }
    }
  }
}
