import InvoicePage from "@/components/pages/invoice/InvoicePage";
import { TSettings } from "@/interfaces";
import directus from "@/lib/directus";
import { readSingleton } from "@directus/sdk";
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
const PageInvoice = async () => {
  const settings = await directus.request(readSingleton("settings"));
  return (
    <Suspense>
      <InvoicePage settings={settings as TSettings} />
    </Suspense>
  );
};

export default PageInvoice;
