"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchNotifications,
  recalculateUnread,
} from "@/store/notificationSlice";
import { isNotificationRead } from "@/lib/notificationUtils";
import type { AppDispatch } from "@/store";
import { TNotification } from "@/interfaces";

export const useNotifications = () => {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadNotifications = async () => {
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

    loadNotifications();
  }, [dispatch]);

  return { readIds, setReadIds, loading };
};
