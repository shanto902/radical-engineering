import InvoicePage from "@/components/pages/invoice/InvoicePage";
import { Metadata } from "next";
import React, { Suspense } from "react";
export const metadata: Metadata = {
  title: "Invoice | Radical Engineering",
  description: "Invoice page of Radical Engineering",
  openGraph: {
    title: "Invoice | Radical Engineering",
    description: "Invoice page of Radical Engineering",
    images: [
      {
        url: "/og/invoice.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Invoice Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice | Radical Engineering",
    description: "Invoice page of Radical Engineering",
    images: ["/og/invoice.jpg"],
  },
};
const page = () => {
  return (
    <Suspense>
      <InvoicePage />
    </Suspense>
  );
};

export default page;
