"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { App as CapacitorApp } from "@capacitor/app";
import { RefreshCcw } from "lucide-react";
import { showCustomToast } from "@/lib/showCustomToast";
import { isNativeApp } from "./common/isNativeApp";

export default function AppInit() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    dispatch(fetchProducts("all"));
  }, [dispatch]);

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
        if (!res.ok) throw new Error("Failed to fetch revalidate status");

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
          await showCustomToast({
            id: "refresh-toast",
            icon: RefreshCcw,
            message: "Refreshing data...",
          });

          if (isNativeApp()) {
            location.reload();
          } else {
            router.refresh();
          }
        } else {
          console.log("%c[Revalidate] No refresh needed.", "color: green;");
        }
      } catch (error) {
        console.error("Error checking revalidate status:", error);
      }
    };

    checkRevalidate();

    const resumeHandler = CapacitorApp.addListener("resume", () => {
      console.log("[Revalidate] App resumed — checking...");
      checkRevalidate();
    });

    return () => {
      resumeHandler.then((h) => h.remove());
    };
  }, [router]);

  return null;
}
