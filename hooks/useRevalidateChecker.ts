"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRevalidateChecker() {
  const router = useRouter();

  useEffect(() => {
    const checkRevalidate = async () => {
      try {
        console.log("Checking revalidate status...");

        const res = await fetch("/api/revalidate-status", {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to fetch revalidate status");
          return;
        }

        const data = await res.json();
        console.log("Received revalidate status:", data);

        // Safely handle null value
        if (!data.lastRevalidateTime) {
          console.log("No lastRevalidateTime set yet, skipping refresh.");
          return;
        }

        const lastRevalidateTime = new Date(data.lastRevalidateTime).getTime();
        console.log("Parsed lastRevalidateTime (ms):", lastRevalidateTime);

        const lastSeen = Number(
          localStorage.getItem("lastSeenRevalidate") || "0"
        );
        console.log("Last seen revalidate time (ms):", lastSeen);

        if (lastRevalidateTime > lastSeen) {
          console.log("New revalidate detected — refreshing page...");
          router.refresh();
          localStorage.setItem(
            "lastSeenRevalidate",
            String(lastRevalidateTime)
          );
        } else {
          console.log("No new revalidate — no refresh needed.");
        }
      } catch (error) {
        console.error("Error checking revalidate status:", error);
      }
    };

    // Call on first load
    checkRevalidate();

    // Optional: you can also poll every X seconds if you want live updates:
    // const interval = setInterval(checkRevalidate, 5000);
    // return () => clearInterval(interval);
  }, [router]);
}
