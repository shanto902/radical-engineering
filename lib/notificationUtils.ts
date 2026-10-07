// /lib/notificationUtils.ts

export async function markAsRead(id: string) {
  if (typeof window === "undefined") return;
  const key = `read_notification_${id}`;
  localStorage.setItem(key, "1");
}

export async function isNotificationRead(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`read_notification_${id}`) === "1";
}

export async function getReadNotificationIds(): Promise<string[]> {
  if (typeof window === "undefined") return [];
  const keys = Object.keys(localStorage);
  return keys
    .filter((key) => key.startsWith("read_notification_"))
    .map((key) => key.replace("read_notification_", ""));
}
