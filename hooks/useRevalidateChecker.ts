// hooks/useRevalidateChecker.ts
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useRevalidateChecker() {
  const router = useRouter();
  const hasRefreshed = useRef(false); // Prevent double refresh per visit

  useEffect(() => {
    const checkRevalidate = async () => {
      console.log(
        "%c[Revalidate] ⏳ Checking revalidate status...",
        "color: gray;"
      );
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
          localStorage.setItem(
            "lastSeenRevalidate",
            String(lastRevalidateTime)
          );
          if (!hasRefreshed.current) {
            hasRefreshed.current = true;
            console.log(
              "%c[Revalidate] ✅ Refreshing (first visit)",
              "color: orange;"
            );
            router.refresh();
          }
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
          localStorage.setItem(
            "lastSeenRevalidate",
            String(lastRevalidateTime)
          );
          if (!hasRefreshed.current) {
            hasRefreshed.current = true;
            console.log(
              "%c[Revalidate] ✅ Refreshing (new revalidate time)",
              "color: orange;"
            );
            router.refresh();
          }
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
        console.error("Error checking revalidate status:", error);
      }
    };

    checkRevalidate();

    // Optional: if you want live check every X seconds:
    // const interval = setInterval(checkRevalidate, 10000); // every 10s
    // return () => clearInterval(interval);
  }, [router]);
}
