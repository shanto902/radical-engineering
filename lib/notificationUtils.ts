// /lib/notificationUtils.ts
import { Preferences } from "@capacitor/preferences";

export async function markAsRead(id: string) {
  const key = `read_notification_${id}`;
  await Preferences.set({ key, value: "1" });
}

export async function isNotificationRead(id: string): Promise<boolean> {
  const { value } = await Preferences.get({ key: `read_notification_${id}` });
  return value === "1";
}

export async function getReadNotificationIds(): Promise<string[]> {
  const { keys } = await Preferences.keys();
  return keys
    .filter((key) => key.startsWith("read_notification_"))
    .map((key) => key.replace("read_notification_", ""));
}
