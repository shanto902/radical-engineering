"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { addNotification } from "@/store/notificationSlice";
import { TNotification } from "@/interfaces";

const PushNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    const setupPush = async () => {
      try {
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive === "granted") {
          await PushNotifications.register();
        }

        PushNotifications.addListener("registration", async (token) => {
          const platform = Capacitor.getPlatform();
          await fetch("/api/save-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token.value, platform }),
          });
        });

        PushNotifications.addListener("registrationError", (error) => {
          console.error("Push registration error:", error);
        });

        PushNotifications.addListener(
          "pushNotificationReceived",
          (notification) => {
            const data = notification.notification
              .data as Partial<TNotification>;
            if (data?.id && data?.title && data?.message && data?.route) {
              dispatch(
                addNotification({
                  id: data.id,
                  title: data.title,
                  message: data.message,
                  route: data.route,
                  date_created: new Date().toISOString(),
                })
              );
            }
          }
        );

        PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (notification) => {
            const route = notification.notification.data?.route as
              | string
              | undefined;
            if (route) {
              router.push(route);
            }
          }
        );
      } catch (error) {
        console.error("Push setup failed:", error);
      }
    };

    setupPush();
  }, [dispatch, router]);

  return null;
};

export default PushNotification;
