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

        // Safely handle null value
        if (!data.lastRevalidateTime) {
          console.warn("No lastRevalidateTime found in API response");
          return;
        }

        const lastRevalidateTime = new Date(data.lastRevalidateTime).getTime();

        const lastSeen = Number(
          localStorage.getItem("lastSeenRevalidate") || "0"
        );

        // Only refresh if server time is newer by at least 500ms
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

    // Optional: you can also poll every X seconds if you want live updates:
    // const interval = setInterval(checkRevalidate, 5000);
    // return () => clearInterval(interval);
  }, [router]);
}
