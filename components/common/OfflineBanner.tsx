"use client";

import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const init = async () => {
      const status = await Network.getStatus();
      setOffline(!status.connected);

      const listener = await Network.addListener(
        "networkStatusChange",
        (status) => {
          setOffline(!status.connected);
        }
      );

      // Clean up on unmount
      return () => {
        listener.remove(); // ✅ Now this will work
      };
    };

    // Immediately invoke async function in useEffect
    const cleanupPromise = init();

    // Optional: to avoid TS warning
    return () => {
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === "function") cleanup();
      });
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-0 bg-red-700 text-white z-[9999] flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-2xl font-bold mb-2">You&apos;re Offline</h2>
      <p className="text-sm opacity-80">
        Please check your internet connection
      </p>
    </div>
  );
}
