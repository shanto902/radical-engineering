"use client";

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

  return isNative ? <MobileNavbar /> : <Navbar settings={settings} />;
}
