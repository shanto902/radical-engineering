"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
    if (!hasMounted) return;

    // Apply after Redux is ready
    if (theme === "light" || theme === "dark") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme, hasMounted]);

  return <>{children}</>;
}
