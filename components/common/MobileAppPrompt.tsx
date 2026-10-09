"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Star } from "lucide-react";
import appIcon from "@/assets/android-chrome-192x192.png";
import { GooglePlayIcon, PLAY_STORE_URL } from "./GooglePlayBadge";

const STORAGE_KEY = "radical_app_prompt_dismissed_until";
const DISMISS_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const INSTALL_DAYS_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export default function MobileAppPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Do not show on checkout page to avoid interrupting checkout flow
    if (pathname?.startsWith("/checkout")) return;

    // Check if user is on a mobile device
    const isMobile =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (!isMobile) return;

    // Check if prompt was previously dismissed and still in cool-off period
    const dismissedUntil = localStorage.getItem(STORAGE_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      return;
    }

    // Delay showing the prompt by 3 seconds for friendly UX (never flash immediately)
    const timer = setTimeout(() => {
      setIsRendered(true);
      // Slight tick for smooth slide-up CSS transition
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember dismissal for 7 days
    try {
      localStorage.setItem(
        STORAGE_KEY,
        (Date.now() + DISMISS_DAYS_MS).toString()
      );
    } catch {
      // ignore storage errors
    }
    setTimeout(() => {
      setIsRendered(false);
    }, 300);
  };

  const handleInstallClick = () => {
    // Remember install click for 30 days
    try {
      localStorage.setItem(
        STORAGE_KEY,
        (Date.now() + INSTALL_DAYS_MS).toString()
      );
    } catch {
      // ignore storage errors
    }
    setIsVisible(false);
    setTimeout(() => {
      setIsRendered(false);
    }, 300);
  };

  if (!isRendered) return null;

  return (
    <div
      role="dialog"
      aria-label="Download Mobile App"
      className={`fixed bottom-3 inset-x-3 sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-md z-[9990] transition-all duration-300 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0px)",
      }}
    >
      <div className="relative overflow-hidden bg-white dark:bg-[#1c1c1c] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Close app prompt"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pr-6">
          {/* App Icon */}
          <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-sm border border-neutral-200 dark:border-neutral-700 shrink-0 flex items-center justify-center">
            <Image
              src={appIcon}
              alt="Radical Engineering App Icon"
              width={40}
              height={40}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* App Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
              Radical Engineering
            </h4>

            <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
              <span className="flex items-center text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span className="ml-0.5">4.9</span>
              </span>
              <span>•</span>
              <span className="truncate">Free on Google Play</span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 truncate mt-0.5">
              Easy shopping & order tracking
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex items-center justify-end gap-2 pt-2.5 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Not now
          </button>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-900 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-100 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95"
          >
            <GooglePlayIcon className="w-3.5 h-3.5" />
            <span>Install App</span>
          </a>
        </div>
      </div>
    </div>
  );
}

