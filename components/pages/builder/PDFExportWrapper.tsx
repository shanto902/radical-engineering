"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Printer } from "lucide-react";

export default function PDFExportWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("solar-system-summary.pdf");
    } catch (error) {
      console.error("PDF Generation Failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative">
      <div ref={pdfRef} className="print-area">
        {children}
      </div>

      {/* Export Button */}
      <div className="text-right mt-6">
        <button
          aria-label="Export PDF"
          onClick={handleExportPDF}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Printer className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Export as PDF"}
        </button>
      </div>
    </div>
  );
}
