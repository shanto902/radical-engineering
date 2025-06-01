"use client";

import { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function StatusBarControl() {
  useEffect(() => {
    const applyStatusBar = async (isDark: boolean) => {
      try {
        await StatusBar.show();

        // Style: Dark = white icons on dark background
        await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });

        // Background color
        await StatusBar.setBackgroundColor({
          color: isDark ? "#181818" : "#f6f2ed",
        });

        // Prevent content from going under status bar
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (err) {
        console.warn("StatusBar error:", err);
      }
    };

    // Initial check
    const match = window.matchMedia("(prefers-color-scheme: dark)");
    applyStatusBar(match.matches);

    // Watch for theme change
    match.addEventListener("change", (e) => {
      applyStatusBar(e.matches);
    });

    return () => {
      match.removeEventListener("change", () => {});
    };
  }, []);

  return null;
}
