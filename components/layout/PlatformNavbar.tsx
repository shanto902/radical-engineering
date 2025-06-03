// components/layout/PlatformNavbar.tsx
"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import MobileNavbar from "@/components/common/MobileNavbar";
import Navbar from "@/components/layout/Navbar";
import { TSettings } from "@/interfaces";

export default function PlatformNavbar({ settings }: { settings: TSettings }) {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    setIsNative(platform === "ios" || platform === "android");
  }, []);

  return isNative ? <MobileNavbar /> : <Navbar settings={settings} />;
}
