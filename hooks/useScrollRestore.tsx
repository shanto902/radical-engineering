/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { isNativeApp } from "@/components/common/isNativeApp";
import { useEffect } from "react";

export default function useScrollRestore(key: string, deps: any[] = []) {
  useEffect(() => {
    if (!isNativeApp()) return;

    let raf1 = requestAnimationFrame(() => {
      raf1 = requestAnimationFrame(() => {
        const scrollY = sessionStorage.getItem(`${key}-scroll-y`);
        if (scrollY !== null) {
          window.scrollTo({ top: parseInt(scrollY), behavior: "auto" });
        }
      });
    });

    return () => cancelAnimationFrame(raf1);
  }, deps);
}
