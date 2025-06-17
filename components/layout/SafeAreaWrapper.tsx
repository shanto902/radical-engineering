"use client";

import { isNativeApp } from "../common/isNativeApp";

export default function SafeAreaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isNative = isNativeApp();

  return (
    <div
      className={
        isNative
          ? "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] min-h-screen"
          : "min-h-screen"
      }
    >
      {children}
    </div>
  );
}
