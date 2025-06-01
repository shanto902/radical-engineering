"use client";

import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { usePathname } from "next/navigation";

export default function BackButtonHandler() {
  const pathname = usePathname();

  useEffect(() => {
    let removeListener: (() => void) | null = null;

    const setupListener = async () => {
      const listener = await CapacitorApp.addListener("backButton", () => {
        if (pathname !== "/") {
          // Go back if not on homepage
          window.history.back();
        } else {
          // Exit app on homepage
          CapacitorApp.exitApp();
        }
      });

      removeListener = () => {
        listener.remove();
      };
    };

    setupListener();

    return () => {
      if (removeListener) removeListener();
    };
  }, [pathname]); // include pathname to update listener on route change

  return null;
}
