import React from "react";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.radicalengineering.bd";

export function GooglePlayIcon({
  className = "w-6 h-6",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.609 1.814L13.793 12 3.61 22.186A2.29 2.29 0 0 1 3 20.573V3.427c0-.626.223-1.196.609-1.613z"
        fill="#00E5FF"
      />
      <path
        d="M17.18 8.613l-3.387 3.387 3.387 3.387 3.82-2.183c1.085-.62 1.085-1.77 0-2.391l-3.82-2.2z"
        fill="#FFD600"
      />
      <path
        d="M13.793 12L3.609 1.814c.328-.354.79-.582 1.312-.582.477 0 .937.195 1.503.518l10.756 6.146L13.793 12z"
        fill="#00E676"
      />
      <path
        d="M13.793 12l3.387-3.387-10.756 6.146c-.566.323-1.026.518-1.503.518-.522 0-.984-.228-1.312-.582L13.793 12z"
        fill="#FF3D00"
      />
    </svg>
  );
}

interface GooglePlayBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light";
}

export default function GooglePlayBadge({
  className = "",
  size = "md",
  theme = "dark",
}: GooglePlayBadgeProps) {
  const isDark = theme === "dark";

  const sizeClasses = {
    sm: "px-3 py-1.5 gap-2",
    md: "px-4 py-2.5 gap-2.5",
    lg: "px-5 py-3 gap-3",
  }[size];

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  const subtextSizes = {
    sm: "text-[8px]",
    md: "text-[9px]",
    lg: "text-[10px]",
  }[size];

  const maintextSizes = {
    sm: "text-xs font-semibold",
    md: "text-sm font-bold",
    lg: "text-base font-bold",
  }[size];

  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Radical Engineering app on Google Play"
      className={`inline-flex items-center rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shrink-0 ${
        isDark
          ? "bg-black hover:bg-neutral-900 text-white border border-white/20"
          : "bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300"
      } ${sizeClasses} ${className}`}
    >
      <GooglePlayIcon className={iconSizes} />
      <div className="text-left leading-none">
        <span
          className={`block uppercase font-medium tracking-wider mb-0.5 ${
            isDark ? "text-neutral-300" : "text-neutral-600"
          } ${subtextSizes}`}
        >
          GET IT ON
        </span>
        <span
          className={`block tracking-tight ${
            isDark ? "text-white" : "text-neutral-900"
          } ${maintextSizes}`}
        >
          Google Play
        </span>
      </div>
    </a>
  );
}

