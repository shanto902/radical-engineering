"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function useRevalidateChecker() {
  const router = useRouter();
  const hasRefreshed = useRef(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkRevalidate = async () => {
      console.log(
        "%c[Revalidate] ⏳ Checking revalidate status...",
        "color: gray;"
      );
      setIsChecking(true);

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
        const lastSeenStr = sessionStorage.getItem("lastSeenRevalidate");
        const lastSeen = Number(lastSeenStr || "0");
        const isFirstVisit = lastSeenStr === null;

        const shouldRefresh =
          isFirstVisit || lastRevalidateTime - lastSeen > 500;

        if (shouldRefresh && !hasRefreshed.current) {
          hasRefreshed.current = true;
          sessionStorage.setItem(
            "lastSeenRevalidate",
            String(lastRevalidateTime)
          );

          console.log("%c[Revalidate] ✅ Refreshing...", "color: orange;");
          toast("Refreshing data...", { icon: "🔄" });
          router.refresh(); // Next.js SSR
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
      } finally {
        setIsChecking(false);
      }
    };

    checkRevalidate();
  }, [router]);

  return { isChecking };
}
