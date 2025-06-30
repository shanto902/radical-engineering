"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { markAsRead, isNotificationRead } from "@/lib/notificationUtils";
import {
  fetchNotifications,
  recalculateUnread,
} from "@/store/notificationSlice";
import type { AppDispatch, RootState } from "@/store";
import { formatDistanceToNow } from "date-fns";

type TNotification = {
  id: string;
  title: string;
  message: string;
  route: string;
  date_created: string;
};

export default function NotificationsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMark = async () => {
      const res = await dispatch(fetchNotifications());

      if ("payload" in res && Array.isArray(res.payload)) {
        const items = res.payload as TNotification[];

        const readCheck = await Promise.all(
          items.map((n) => isNotificationRead(n.id))
        );

        const read = items.filter((_, i) => readCheck[i]).map((n) => n.id);

        const unreadCount = items.length - read.length;

        setReadIds(new Set(read));
        dispatch(recalculateUnread(unreadCount));
      }

      setLoading(false);
    };

    fetchAndMark();
  }, [dispatch]);

  const handleClick = async (notif: TNotification) => {
    await markAsRead(notif.id);
    setReadIds((prev) => new Set(prev).add(notif.id));

    // Update unread count
    const unreadLeft = notifications.filter(
      (n) => !readIds.has(n.id) && n.id !== notif.id
    );
    dispatch(recalculateUnread(unreadLeft.length));

    if (notif.route) router.push(notif.route);
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No notifications found.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-5 text-center text-primary">
        Notifications
      </h1>
      <div className="space-y-4">
        {notifications.map((notif) => {
          const isRead = readIds.has(notif.id);
          return (
            <div
              key={notif.id}
              onClick={() => handleClick(notif)}
              className={`p-4 rounded-lg border shadow-sm cursor-pointer transition-all hover:shadow-md ${
                isRead
                  ? "bg-background"
                  : "bg-red-50 dark:bg-red-900/20 text-foreground"
              }`}
            >
              <h2 className="font-semibold text-base text-foreground">
                {notif.title}
              </h2>
              <p className="text-sm mt-1 text-muted-foreground">
                {notif.message}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(notif.date_created), {
                  addSuffix: true,
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
