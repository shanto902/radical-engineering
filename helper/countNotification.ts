import { TNotification } from "@/interfaces";
import { isNotificationRead } from "@/lib/notificationUtils";

export const countUnreadNotifications = async (
  notifications: TNotification[]
) => {
  let count = 0;

  for (const notification of notifications) {
    const read = await isNotificationRead(notification.id);
    if (!read) count++;
  }

  return count;
};
