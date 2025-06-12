// hooks/useRevalidateChecker.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRevalidateChecker() {
  const router = useRouter();

  useEffect(() => {
    const checkRevalidate = async () => {
      try {
        const res = await fetch("/api/revalidate-status", {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to fetch revalidate status");
          return;
        }

        const data = await res.json();

        const lastRevalidateTime = Number(data.lastRevalidateTime);
        const lastSeenStr = localStorage.getItem("lastSeenRevalidate");
        const lastSeen = Number(lastSeenStr || "0");
        const isFirstVisit = lastSeenStr === null;

        if (isFirstVisit) {
          console.log(
            "%c[Revalidate] First visit - force refresh.",
            "color: blue; font-weight: bold;"
          );
          router.refresh();
          localStorage.setItem(
            "lastSeenRevalidate",
            String(lastRevalidateTime)
          );
          return;
        }

        if (lastRevalidateTime - lastSeen > 500) {
          console.log(
            "%c[Revalidate] Triggering refresh. Server:",
            "color: orange; font-weight: bold;",
            lastRevalidateTime,
            "Last seen:",
            lastSeen
          );
          router.refresh();
          localStorage.setItem(
            "lastSeenRevalidate",
            String(lastRevalidateTime)
          );
        } else {
          console.log(
            "%c[Revalidate] No refresh needed. Server:",
            "color: green;",
            lastRevalidateTime,
            "Last seen:",
            lastSeen
          );
        }
      } catch (error) {
        console.error("Error checking revalidate status: ", error);
      }
    };

    // Call on first load
    checkRevalidate();

    // Optional: Poll every X seconds for live updates:
    // const interval = setInterval(checkRevalidate, 10000); // every 10 sec
    // return () => clearInterval(interval);
  }, [router]);
}
