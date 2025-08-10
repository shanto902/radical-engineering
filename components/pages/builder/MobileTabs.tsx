// app/app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Lazy-load builders (client-only)
const SolarBuilder = dynamic(() => import("./SolarSystemBuilder"), {
  ssr: false,
  loading: () => (
    <div className="p-6 text-center text-sm text-muted-foreground">
      Loading Solar Builder…
    </div>
  ),
});
const IPSBuilder = dynamic(() => import("./IPSBuilder"), {
  ssr: false,
  loading: () => (
    <div className="p-6 text-center text-sm text-muted-foreground">
      Loading IPS Builder…
    </div>
  ),
});

type TabKey = "solar" | "ips";

export default function MobileTabs() {
  const router = useRouter();
  const search = useSearchParams();
  const initialTab = (search.get("tab") as TabKey) || "solar";
  const [active, setActive] = useState<TabKey>(initialTab);

  // Keep URL in sync (no full navigation)
  useEffect(() => {
    const params = new URLSearchParams(Array.from(search.entries()));
    params.set("tab", active);
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const tabs = useMemo(
    () => [
      {
        key: "solar" as const,
        label: "Solar System",
        accent: "from-yellow-200 to-yellow-400",
        text: "text-yellow-900",
      },
      {
        key: "ips" as const,
        label: "IPS System",
        accent: "from-blue-200 to-blue-400",
        text: "text-blue-900",
      },
    ],
    []
  );

  return (
    <>
      {/* Desktop blocker (mobile-only page) */}
      <div className="hidden md:flex min-h-screen items-center justify-center">
        <div className="rounded-xl border px-6 py-4 shadow-sm">
          <p className="text-sm text-muted-foreground">
            This page is designed for mobile screens. Please open it on a phone.
          </p>
        </div>
      </div>

      {/* Mobile UI */}
      <div className="md:hidden min-h-screen flex flex-col pb-20">
        {/* Tabs header */}
        <div className="px-4 pt-6">
          <div
            role="tablist"
            aria-label="Builders"
            className="grid grid-cols-2 gap-3"
          >
            {tabs.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${t.key}-panel`}
                  onClick={() => setActive(t.key)}
                  className={[
                    "p-4 rounded-xl shadow-lg flex items-center justify-between gap-3 transition",
                    "hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2",
                    isActive ? "ring-2 ring-offset-2" : "",
                    `bg-gradient-to-br ${t.accent}`,
                  ].join(" ")}
                >
                  <div className="flex-1 text-left">
                    <h3 className={`text-sm font-bold ${t.text}`}>
                      {t.key === "solar"
                        ? "Solar System Builder"
                        : "IPS System Builder"}
                    </h3>
                  </div>
                  <div
                    className={[
                      "w-12 h-12 text-white rounded-full flex items-center justify-center animate-pulse",
                      t.key === "solar" ? "bg-yellow-500" : "bg-blue-500",
                    ].join(" ")}
                  >
                    {t.key === "solar" ? (
                      // Sun-ish icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v1.5m0 15V21m9-9h-1.5M3 12H1.5m16.364-6.364l-1.06 1.06M6.364 17.636l-1.06 1.06m12.728 0l-1.06-1.06M6.364 6.364L5.303 5.303M12 7.5a4.5 4.5 0 110 9a4.5 4.5 0 010-9z"
                        />
                      </svg>
                    ) : (
                      // Lightning-ish icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5l-6 7.5h4.5L10.5 19.5l6-7.5H12l1.5-7.5z"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active indicator */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {tabs.map((t) => (
              <div
                key={t.key}
                className="relative h-1 rounded-full bg-neutral-200 overflow-hidden"
              >
                <span
                  className={[
                    "absolute inset-y-0 left-0 transition-all",
                    active === t.key ? "w-full" : "w-0",
                    t.key === "solar" ? "bg-yellow-500" : "bg-blue-500",
                  ].join(" ")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Panels */}
        <div className="px-4 pt-4 flex-1">
          <section
            id="solar-panel"
            role="tabpanel"
            aria-labelledby="solar-tab"
            hidden={active !== "solar"}
            className={active === "solar" ? "block" : "hidden"}
          >
            <div className="rounded-xl border bg-background shadow-sm">
              <SolarBuilder />
            </div>
          </section>

          <section
            id="ips-panel"
            role="tabpanel"
            aria-labelledby="ips-tab"
            hidden={active !== "ips"}
            className={active === "ips" ? "block" : "hidden"}
          >
            <div className="rounded-xl border bg-background shadow-sm">
              <IPSBuilder />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
