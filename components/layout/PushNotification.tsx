"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";

const PushNotification = () => {
  const router = useRouter();

  useEffect(() => {
    const setupPush = async () => {
      try {
        // Request permission for push notifications
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive === "granted") {
          await PushNotifications.register();
        }

        // Handle registration
        PushNotifications.addListener("registration", async (token) => {
          const platform = Capacitor.getPlatform();
          await fetch("/api/save-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token.value, platform }),
          });
        });

        // Handle registration error
        PushNotifications.addListener("registrationError", (error) => {
          console.error("Push registration error:", error);
        });

        // Optional: Handle when a push is received while app is in foreground
        PushNotifications.addListener(
          "pushNotificationReceived",
          (notification) => {
            console.log("Push received:", notification);
          }
        );

        // Handle tap on notification (cold start or foreground)
        PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (notification) => {
            const route = notification.notification.data?.route;
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
  }, [router]);

  return null; // This component has no UI
};

export default PushNotification;
