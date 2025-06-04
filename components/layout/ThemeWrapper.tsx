"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Capacitor } from "@capacitor/core";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const isNative =
      Capacitor.getPlatform() === "ios" ||
      Capacitor.getPlatform() === "android";

    if (!hasMounted) return;

    if (isNative) {
      const media = window.matchMedia("(prefers-color-scheme: dark)");

      const applySystemTheme = () => {
        const isDark = media.matches;
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(isDark ? "dark" : "light");
      };

      applySystemTheme();
      media.addEventListener("change", applySystemTheme);

      return () => media.removeEventListener("change", applySystemTheme);
    } else {
      // ✅ Only apply after Redux is ready
      if (theme === "light" || theme === "dark") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
      }
    }
  }, [theme, hasMounted]);

  return <>{children}</>;
}
