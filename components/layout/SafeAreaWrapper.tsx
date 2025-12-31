"use client";

import { isNativeApp } from "../common/isNativeApp";

export default function SafeAreaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isNative = isNativeApp();

  return (
    <div className={isNative ? "safe-area min-h-screen" : "min-h-screen"}>
      {children}
    </div>
  );
}
