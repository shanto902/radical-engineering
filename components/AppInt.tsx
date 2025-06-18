"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { App as CapacitorApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { showCustomToast } from "@/lib/showCustomToast";
import { RefreshCcw } from "lucide-react";
import FontFaceObserver from "fontfaceobserver";
import { isNativeApp } from "./common/isNativeApp";
import Image from "next/image";
import logo from "@/assets/logo-square.svg";

export default function AppInit() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const hasRefreshed = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // Marks React hydration as complete
  }, []);

  useEffect(() => {
    const waitForFonts = async () => {
      try {
        const lato = new FontFaceObserver("Lato");
        await lato.load(null, 3000);
      } catch {
        console.warn("⚠️ Font load timeout");
      }
    };

    const preloadImages = async () => {
      const images = Array.from(document.images);
      await Promise.allSettled(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.onload = img.onerror = resolve;
              })
        )
      );
    };

    const checkRevalidate = async () => {
      try {
        const res = await fetch("/api/revalidate-status", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed revalidate fetch");

        const data = await res.json();
        const lastRevalidateTime = Number(data.lastRevalidateTime);
        const lastSeen = Number(
          sessionStorage.getItem("lastSeenRevalidate") || "0"
        );
        const shouldRefresh =
          lastSeen === 0 || lastRevalidateTime - lastSeen > 500;

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
            router.refresh();
          } else {
            location.reload();
          }
        }
      } catch (err) {
        console.error("❌ Revalidate error:", err);
      }
    };

    const initApp = async () => {
      // Trigger splash hide fast
      if (isNativeApp()) {
        setTimeout(() => {
          SplashScreen.hide().then(() =>
            console.log("✅ Splash screen hidden")
          );
        }, 300);
      }

      // Load everything else in background
      Promise.allSettled([
        dispatch(fetchProducts("all")),
        checkRevalidate(),
        waitForFonts(),
        preloadImages(),
      ]);
    };

    if (hydrated) {
      initApp();
    }

    // Resume handler for revalidate
    let removeResumeListener: () => void;
    CapacitorApp.addListener("resume", () => {
      console.log("[Resume] Checking again...");
      initApp();
    }).then((handler) => {
      removeResumeListener = handler.remove;
    });

    return () => {
      if (removeResumeListener) removeResumeListener();
    };
  }, [hydrated, dispatch, router]);

  // Optional: basic screen blocker before hydration
  if (!hydrated) {
    return (
      <div className="fixed inset-0  bg-[#3c1100] z-[9999] flex flex-col gap-5 items-center justify-center">
        <Image src={logo} alt="Logo" className=" object-contain w-fit h-28" />

        <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></span>
      </div>
    );
  }

  return null;
}
