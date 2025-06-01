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
        if (pathname === "/" || pathname === "/home") {
          // 🟢 Exit the app if on home page
          CapacitorApp.exitApp();
        } else {
          // 🔙 Go back if on any other page
          window.history.back();
        }
      });

      removeListener = () => listener.remove();
    };

    setupListener();

    return () => {
      if (removeListener) removeListener();
    };
  }, [pathname]);

  return null;
}
