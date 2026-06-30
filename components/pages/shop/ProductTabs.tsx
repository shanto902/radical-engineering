"use client";

import { Body } from "@/components/common/Body";
import { isNativeApp } from "@/components/common/isNativeApp";
import { getImageUrl } from "@/utils/image-url";
import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";

interface ProductTabsProps {
  productDetails?: string;
  pdfUrl?: string | null;
  userManual?: string | null;
}

interface PdfViewerProps {
  url: string;
  title: string;
}

const PdfViewer = ({ url, title }: PdfViewerProps) => {
  const fullUrl = getImageUrl(url);
  const downloadUrl = `${fullUrl}?download`;
  const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
    fullUrl
  )}&embedded=true`;

  return (
    <div className="flex flex-col gap-4">
      {/* Sleek Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <FileText className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md border border-gray-300 hover:border-primary dark:border-zinc-700 dark:hover:border-primary transition text-foreground hover:text-primary bg-background"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in New Tab</span>
          </a>
          <a
            href={downloadUrl}
            download
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-md bg-primary hover:bg-secondary text-background hover:text-foreground transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full h-[600px] relative overflow-hidden rounded-md border border-gray-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
        <iframe
          src={googleDocsUrl}
          className="w-full h-full border-none"
          loading="lazy"
          title={`${title} Preview`}
        />
      </div>
    </div>
  );
};

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
          <PdfViewer url={pdfUrl!} title="Data Sheet" />
        ) : activeTab === "manual" && hasManual ? (
          <PdfViewer url={userManual!} title="User Manual" />
        ) : null}
      </div>
    </div>
  );
};

export default ProductTabs;
