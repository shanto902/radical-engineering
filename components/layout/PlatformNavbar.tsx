"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import { TSettings } from "@/interfaces";

const MobileNavbar = dynamic(() => import("@/components/layout/MobileNavbar"), {
  ssr: false,
});

export default function PlatformNavbar({ settings }: { settings: TSettings }) {
  const platform = Capacitor.getPlatform();
  const isNative = platform === "ios" || platform === "android";

  const [isReady, setIsReady] = useState(!isNative); // ready immediately on web

  useEffect(() => {
    if (!isNative) return;

    const hideSplash = async () => {
      const { SplashScreen } = await import("@capacitor/splash-screen");
      setTimeout(async () => {
        await SplashScreen.hide();
        setIsReady(true);
      }, 100); // slight buffer
    };

    hideSplash();
  }, [isNative]);

  if (!isReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <span className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent rounded-full text-primary" />
      </div>
    );
  }

  return isNative ? <MobileNavbar /> : <Navbar settings={settings} />;
}
