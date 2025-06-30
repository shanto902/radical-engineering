"use client";

import { useEffect } from "react";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";

const PushNotification = () => {
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
            console.log("Push received:", notification);
          }
        );

        PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (notification) => {
            console.log("Push action performed:", notification);
          }
        );
      } catch (error) {
        console.error("Push setup failed:", error);
      }
    };

    setupPush();
  }, []);

  return null; // No UI needed
};

export default PushNotification;
