"use client";

import { useEffect, useRef, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { closeCartSidebar } from "@/store/cartUISlice";
import { RootState } from "@/store";
import { closeSearch, closeCategoryDrawer } from "@/store/uiSlice";
import { isNativeApp } from "@/components/common/isNativeApp";

export default function BackButtonHandler() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();

  const isCartOpen = useSelector(
    (state: RootState) => state.cartUI.isSidebarOpen
  );
  const { searchOpen, categoryDrawerOpen } = useSelector(
    (state: RootState) => state.ui
  );

  // Keep latest pathname
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // 🔁 Shared Back Handling Logic
  const handleBack = async (isNative = false) => {
    if (searchOpen) {
      dispatch(closeSearch());
      if (isNative) await Haptics.impact({ style: ImpactStyle.Light });
      return;
    }

    if (categoryDrawerOpen) {
      dispatch(closeCategoryDrawer());
      if (isNative) await Haptics.impact({ style: ImpactStyle.Light });
      return;
    }

    if (isCartOpen) {
      dispatch(closeCartSidebar());
      if (isNative) await Haptics.impact({ style: ImpactStyle.Medium });
      return;
    }

    const currentPath = pathnameRef.current;
    if (currentPath === "/mobile") {
      if (isNative) await Haptics.impact({ style: ImpactStyle.Medium });
      setShowDialog(true);
    } else {
      if (currentPath.startsWith("/categories/all")) {
        sessionStorage.setItem("shop-scroll-y", window.scrollY.toString());
      }
      window.history.back();
    }
  };

  // 🌐 Web back button support
  useEffect(() => {
    const browserHandler = (e: PopStateEvent) => {
      e.preventDefault();
      handleBack(false);
    };

    window.addEventListener("popstate", browserHandler);
    return () => {
      window.removeEventListener("popstate", browserHandler);
    };
  }, [searchOpen, categoryDrawerOpen, isCartOpen]);

  // 📱 Capacitor back button support
  useEffect(() => {
    if (!isNativeApp()) return;

    const setupListener = async () => {
      const listener = await CapacitorApp.addListener(
        "backButton",
        async () => {
          await handleBack(true);
        }
      );
      return () => listener.remove();
    };

    const cleanupPromise = setupListener();
    return () => {
      cleanupPromise.then((remove) => remove?.());
    };
  }, [searchOpen, categoryDrawerOpen, isCartOpen]);

  // 🛑 Confirm Exit Modal
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
