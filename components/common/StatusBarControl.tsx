"use client";

import { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

export default function StatusBarControl() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const applyStatusBar = async (isDark: boolean) => {
      try {
        await StatusBar.show();
        await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
        await StatusBar.setBackgroundColor({
          color: isDark ? "#181818" : "#f6f2ed",
        });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (err) {
        console.warn("StatusBar error:", err);
      }
    };

    const match = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => applyStatusBar(e.matches);

    applyStatusBar(match.matches);
    match.addEventListener("change", handleChange);

    return () => {
      match.removeEventListener("change", handleChange);
    };
  }, []);

  return null;
}
