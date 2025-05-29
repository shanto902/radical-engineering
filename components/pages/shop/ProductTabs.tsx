"use client";

import { Body } from "@/components/common/Body";
import { getImageUrl } from "@/utils/image-url";
import { useState } from "react";

const ProductTabs = ({
  productDetails,
  pdfUrl,
}: {
  productDetails?: string;
  pdfUrl?: string | null;
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "pdf">("details");

  const hasDetails = Boolean(productDetails);
  const hasPdf = Boolean(pdfUrl);

  // No tabs or content if nothing is available
  if (!hasDetails && !hasPdf) return null;

  return (
    <div className="mt-8">
      {/* Tabs header */}
      <div className="flex border-b border-gray-300">
        {hasDetails && (
          <button
            onClick={() => setActiveTab("details")}
            className={`py-2 px-4 text-sm font-semibold transition ${
              activeTab === "details"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            Product Details
          </button>
        )}
        {hasPdf && (
          <button
            onClick={() => setActiveTab("pdf")}
            className={`py-2 px-4 text-sm font-semibold transition ${
              activeTab === "pdf"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            Data Sheet
          </button>
        )}
      </div>

      {/* Tab content */}
      <div className="p-4 border border-t-0 border-gray-300 rounded-md">
        {activeTab === "details" && hasDetails ? (
          <Body className="rich-text">{productDetails || ""}</Body>
        ) : activeTab === "pdf" && hasPdf ? (
          <div className="w-full h-[600px]">
            <iframe
              src={getImageUrl(pdfUrl as string)}
              className="w-full h-full rounded-md border"
              loading="lazy"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductTabs;
