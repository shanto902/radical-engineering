"use client";

import { useEffect, useRef, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { isNativeApp } from "@/components/common/isNativeApp";
import { usePathname } from "next/navigation";

export default function BackButtonHandler() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const [showDialog, setShowDialog] = useState(false);

  // Keep latest pathname
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Setup native back button handling
  useEffect(() => {
    if (!isNativeApp()) return;

    const setupListener = async () => {
      const listener = await CapacitorApp.addListener(
        "backButton",
        async () => {
          const currentPath = pathnameRef.current;

          if (currentPath === "/mobile") {
            await Haptics.impact({ style: ImpactStyle.Medium });
            setShowDialog(true);
          } else {
            if (currentPath.startsWith("/categories/all")) {
              sessionStorage.setItem(
                "shop-scroll-y",
                window.scrollY.toString()
              );
            }

            window.history.back();
          }
        }
      );

      return () => {
        listener.remove();
      };
    };

    const cleanupPromise = setupListener();

    return () => {
      cleanupPromise.then((remove) => remove?.());
    };
  }, []);

  // Handle exit
  const confirmExit = async () => {
    await Haptics.impact({ style: ImpactStyle.Heavy });
    CapacitorApp.exitApp();
  };

  const cancelExit = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
    setShowDialog(false);
  };

  return (
    <>
      {showDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-background rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Exit App?</h2>
            <p className="text-sm mb-6 text-muted-foreground">
              Are you sure you want to close the app?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelExit}
                className="px-4 py-2 bg-primary text-background rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-2 bg-red-600 text-white rounded font-semibold"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
