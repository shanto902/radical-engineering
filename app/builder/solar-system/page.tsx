import SolarSystemBuilder from "@/components/pages/builder/SolarSystemBuilder";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Solar System Builder | Radical Engineering",
  description:
    "Design your own solar system with Radical Engineering. Calculate load, choose components, and build a complete solar setup tailored to your home or business.",
  openGraph: {
    title: "Solar System Builder | Radical Engineering",
    description:
      "Design your own solar system with Radical Engineering. Calculate load, choose components, and build a complete solar setup tailored to your home or business.",
    images: [
      {
        url: "/og/solar-system-builder.jpg", // Recommended: Add this image to your public/og directory
        width: 1200,
        height: 630,
        alt: "Solar System Builder Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar System Builder | Radical Engineering",
    description:
      "Design your own solar system with Radical Engineering. Calculate load, choose components, and build a complete solar setup tailored to your home or business.",
    images: ["/og/solar-builder.jpg"],
  },
};

const page = () => {
  return <SolarSystemBuilder />;
};

export default page;
