"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { markAsRead, isNotificationRead } from "@/lib/notificationUtils";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchNotifications,
  recalculateUnread,
} from "@/store/notificationSlice";

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

    // Recalculate unread after marking this as read
    const unreadLeft = notifications.filter(
      (n) => !readIds.has(n.id) && n.id !== notif.id
    );
    dispatch(recalculateUnread(unreadLeft.length));

    router.push(notif.route);
  };

  if (loading) {
    return <div className="p-4 text-center text-sm">Loading...</div>;
  }

  if (!notifications.length) {
    return (
      <div className="p-4 text-center text-sm">No notifications found.</div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Notifications</h1>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          onClick={() => handleClick(notif)}
          className={`cursor-pointer border p-4 mb-2 rounded transition ${
            readIds.has(notif.id) ? "bg-gray-100" : "bg-red-100"
          }`}
        >
          <h2 className="font-semibold">{notif.title}</h2>
          <p className="text-sm text-muted-foreground">{notif.message}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notif.date_created).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
