"use client";
import { isNativeApp } from "@/components/common/isNativeApp";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useScrollRestore(key: string, deps: any[] = []) {
  useEffect(() => {
    if (!isNativeApp()) return;

    // Wait for DOM + product list render
    const restoreScroll = () => {
      const scrollY = sessionStorage.getItem(`${key}-scroll-y`);
      if (scrollY !== null) {
        window.scrollTo({ top: parseInt(scrollY), behavior: "auto" });
      }
    };

    // Try restoring in a frame or after short delay
    const frame = requestAnimationFrame(() => {
      setTimeout(restoreScroll, 200); // adjust if needed
    });

    return () => cancelAnimationFrame(frame);
  }, deps);
}
