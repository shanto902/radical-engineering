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

      // Update html class manually
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

    // Initial run
    applyStatusBar();

    // On prefers-color-scheme change (browser level)
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => applyStatusBar();
    media.addEventListener("change", onMediaChange);

    // On app resume
    const resumeHandler = CapacitorApp.addListener("resume", () =>
      applyStatusBar()
    );

    return () => {
      media.removeEventListener("change", onMediaChange);
      resumeHandler.then((handle) => handle.remove());
    };
  }, []);

  return null;
}
