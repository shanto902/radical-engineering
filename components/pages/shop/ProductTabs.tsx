"use client";

import { Body } from "@/components/common/Body";
import { useState } from "react";

const ProductTabs = ({
  productDetails,
  pdfUrl,
}: {
  productDetails: string;
  pdfUrl: string;
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "pdf">("details");

  return (
    <div className="mt-8">
      {/* Tab headers */}
      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab("details")}
          className={`py-2 px-4 text-sm font-semibold ${
            activeTab === "details"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600"
          }`}
        >
          Product Details
        </button>
        <button
          onClick={() => setActiveTab("pdf")}
          className={`py-2 px-4 text-sm font-semibold ${
            activeTab === "pdf"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600"
          }`}
        >
          Data Sheet
        </button>
      </div>

      {/* Tab content */}
      <div className="p-4 border border-t-0 border-gray-300 rounded-md">
        {activeTab === "details" ? (
          productDetails && <Body className="rich-text">{productDetails}</Body>
        ) : (
          <div className="w-full h-[600px]">
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-md border"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
