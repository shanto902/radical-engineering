import IPSBuilder from "@/components/pages/builder/IPSBuilder";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "IPS System Builder | Radical Engineering",
  description:
    "Create a customized IPS backup power system with Radical Engineering. Calculate your load and get the right battery and IPS unit recommendation for your home or office.",
  openGraph: {
    title: "IPS System Builder | Radical Engineering",
    description:
      "Create a customized IPS backup power system with Radical Engineering. Calculate your load and get the right battery and IPS unit recommendation for your home or office.",
    images: [
      {
        url: "/og/ips-builder.jpg", // Recommended: Add this image to your public/og directory
        width: 1200,
        height: 630,
        alt: "IPS System Builder Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPS System Builder | Radical Engineering",
    description:
      "Create a customized IPS backup power system with Radical Engineering. Calculate your load and get the right battery and IPS unit recommendation for your home or office.",
    images: ["/og/ips-builder.jpg"],
  },
};

const page = () => {
  return <IPSBuilder />;
};

export default page;
