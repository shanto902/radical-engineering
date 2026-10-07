/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";

export default function useScrollRestore(key: string, deps: any[] = []) {
  useEffect(() => {
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
