export interface ToastNotification {
  id: string;
  title: string;
  body: string;
  type: 'vitamin' | 'water' | 'kick' | 'appointment' | 'weekly-milestone' | 'info';
  timestamp: number;
}

export function isPushNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getPushPermission(): NotificationPermission {
  if (!isPushNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) return 'denied';
  try {
    const res = await Notification.requestPermission();
    return res;
  } catch {
    return 'denied';
  }
}

export function triggerPushNotification(
  title: string,
  options: {
    body: string;
    icon?: string;
    tag?: string;
    badge?: string;
  }
): boolean {
  if (!isPushNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    new Notification(title, {
      body: options.body,
      icon: options.icon || 'https://api.iconify.design/lucide:heart-handshake.svg',
      tag: options.tag || 'babybloom-reminder'
    });
    return true;
  } catch (err) {
    console.warn('System notification blocked or unsupported in current container:', err);
    return false;
  }
}
