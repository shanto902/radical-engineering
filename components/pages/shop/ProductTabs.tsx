"use client";

import { Body } from "@/components/common/Body";
import { isNativeApp } from "@/components/common/isNativeApp";
import { getImageUrl } from "@/utils/image-url";
import { useEffect, useState } from "react";

interface ProductTabsProps {
  productDetails?: string;
  pdfUrl?: string | null;
  userManual?: string | null;
}

const ProductTabs = ({
  productDetails,
  pdfUrl,
  userManual,
}: ProductTabsProps) => {
  const initialTab: "details" | "pdf" | "manual" = productDetails
    ? "details"
    : pdfUrl
    ? "pdf"
    : "manual";

  const [activeTab, setActiveTab] = useState<"details" | "pdf" | "manual">(
    initialTab
  );

  const hasDetails = !!productDetails;
  const hasPdf = !!pdfUrl;
  const hasManual = !!userManual;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile by screen size or native app
    const checkMobile = () => {
      if (isNativeApp() || window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!hasDetails && !hasPdf && !hasManual) return null;

  return (
    <div className="mt-8 mb-10">
      {/* Tabs header */}
      <div className="flex overflow-hidden justify-center">
        {hasDetails && (
          <button
            aria-label="Details Tab"
            onClick={() => setActiveTab("details")}
            className={`py-2 px-4 text-base font-semibold transition ${
              activeTab === "details"
                ? "border-b-2 border-primary text-primary"
                : "hover:text-primary"
            }`}
          >
            Product Details
          </button>
        )}
        {hasPdf && (
          <button
            aria-label="Data Sheet Tab"
            onClick={() => setActiveTab("pdf")}
            className={`py-2 px-4 text-base font-semibold transition ${
              activeTab === "pdf"
                ? "border-b-2 border-primary text-primary"
                : "hover:text-primary"
            }`}
          >
            Data Sheet
          </button>
        )}
        {hasManual && (
          <button
            aria-label="User Manual Tab"
            onClick={() => setActiveTab("manual")}
            className={`py-2 px-4 text-base font-semibold transition ${
              activeTab === "manual"
                ? "border-b-2 border-primary text-primary"
                : "hover:text-primary"
            }`}
          >
            User Manual
          </button>
        )}
      </div>

      {/* Tab content */}
      <div className="p-4 border border-gray-300 rounded-xl">
        {activeTab === "details" &&
        hasDetails &&
        typeof productDetails === "string" ? (
          <Body className="rich-text sm:p-2 md:p-4">{productDetails}</Body>
        ) : activeTab === "pdf" && hasPdf ? (
          <div className="w-full h-[600px]">
            {isMobile ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  getImageUrl(pdfUrl!)
                )}&embedded=true`}
                className="w-full h-full rounded-md border"
                loading="lazy"
              />
            ) : (
              <iframe
                src={getImageUrl(pdfUrl!)}
                className="w-full h-full rounded-md border"
                loading="lazy"
              />
            )}
          </div>
        ) : activeTab === "manual" && hasManual ? (
          <div className="w-full h-[600px]">
            {isMobile ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  getImageUrl(userManual!)
                )}&embedded=true`}
                className="w-full h-full rounded-md border"
                loading="lazy"
              />
            ) : (
              <iframe
                src={getImageUrl(userManual!)}
                className="w-full h-full rounded-md border"
                loading="lazy"
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductTabs;
