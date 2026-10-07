"use client";

import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    if (typeof window !== "undefined") {
      setOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-0 bg-background text-red-600 text-xl z-[9999] flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-2xl font-bold mb-2">You&apos;re Offline</h2>
      <p className="text-sm opacity-80">
        Please check your internet connection
      </p>
    </div>
  );
}
