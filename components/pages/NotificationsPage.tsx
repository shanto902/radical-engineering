"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { markAsRead, isNotificationRead } from "@/lib/notificationUtils";

type TNotification = {
  id: string;
  title: string;
  message: string;
  route: string;
  date_created: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("Failed to fetch");

        const data: { notifications: TNotification[] } = await res.json();

        if (!Array.isArray(data.notifications)) {
          throw new Error("Invalid format from API");
        }

        const readChecks = await Promise.all(
          data.notifications.map((n) => isNotificationRead(n.id))
        );

        const read = new Set(
          data.notifications.filter((_, i) => readChecks[i]).map((n) => n.id)
        );

        setNotifications(data.notifications);
        setReadIds(read);
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = async (notif: TNotification) => {
    await markAsRead(notif.id);
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
