"use client";

import { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

export default function StatusBarControl() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const applyStatusBar = async () => {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      // Update html class manually here (since ThemeWrapper may not update fast enough)
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(prefersDark ? "dark" : "light");

      try {
        await StatusBar.show();
        await StatusBar.setStyle({
          style: prefersDark ? Style.Dark : Style.Light,
        });
        await StatusBar.setBackgroundColor({
          color: prefersDark ? "#181818" : "#f6f2ed",
        });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (err) {
        console.warn("StatusBar error:", err);
      }
    };

    // Initial theme match
    applyStatusBar();

    // On theme change while app is open
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyStatusBar();
    media.addEventListener("change", onChange);

    // ✅ Force apply on resume with fresh prefers-color-scheme
    const resumeHandler = CapacitorApp.addListener("resume", applyStatusBar);

    return () => {
      media.removeEventListener("change", onChange);
      resumeHandler.then((handle) => handle.remove());
    };
  }, []);

  return null;
}
