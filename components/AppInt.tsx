"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { App as CapacitorApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { RefreshCcw } from "lucide-react";
import { showCustomToast } from "@/lib/showCustomToast";
import { isNativeApp } from "./common/isNativeApp";
import FontFaceObserver from "fontfaceobserver";

export default function AppInit() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const hasRefreshed = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // Ensure React hydration is complete before triggering anything
  }, []);

  useEffect(() => {
    const waitForFonts = async () => {
      const lato = new FontFaceObserver("Lato");
      try {
        await lato.load(null, 3000); // Wait up to 3 seconds
        console.log("✅ Fonts loaded");
      } catch {
        console.warn("⚠️ Font loading timeout");
      }
    };

    const preloadImages = async () => {
      const images = Array.from(document.images);
      await Promise.allSettled(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          });
        })
      );
      console.log("✅ Images loaded");
    };

    const checkRevalidate = async () => {
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

          if (!isNativeApp()) {
            await showCustomToast({
              id: "refresh-toast",
              icon: RefreshCcw,
              message: "Refreshing data...",
            });
          }

          if (isNativeApp()) {
            location.reload();
          } else {
            router.refresh();
          }
        } else {
          console.log("%c[Revalidate] No refresh needed.", "color: green;");
        }
      } catch (error) {
        console.error("❌ Revalidate check failed:", error);
      }
    };

    const initApp = async () => {
      try {
        await dispatch(fetchProducts("all"));
        await checkRevalidate();
        await waitForFonts();
        await preloadImages();
      } catch (e) {
        console.error("❌ Init error:", e);
      }

      if (isNativeApp()) {
        await SplashScreen.hide();
        console.log("✅ Splash screen hidden");
      }
    };

    if (hydrated) {
      initApp();
    }

    let removeResumeListener: () => void;

    CapacitorApp.addListener("resume", () => {
      console.log("[Revalidate] App resumed — checking...");
      initApp();
    }).then((handler) => {
      removeResumeListener = handler.remove;
    });

    return () => {
      if (removeResumeListener) removeResumeListener();
    };
  }, [dispatch, hydrated, router]);

  return null;
}
