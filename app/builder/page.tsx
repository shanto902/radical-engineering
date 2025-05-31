import SolarCalculator from "@/components/pages/builder/SolarCalculator";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Solar & IPS System Builder | Radical Engineering",
  description:
    "Build your own solar or IPS system. Calculate power needs and customize a solution tailored to your home or business with our easy-to-use builder tool.",
  openGraph: {
    title: "Solar & IPS System Builder | Radical Engineering",
    description:
      "Build your own solar or IPS system. Calculate power needs and customize a solution tailored to your home or business with our easy-to-use builder tool.",
    images: [
      {
        url: "/og/builder.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Solar & IPS System Builder Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar & IPS System Builder | Radical Engineering",
    description:
      "Build your own solar or IPS system. Calculate power needs and customize a solution tailored to your home or business with our easy-to-use builder tool.",
    images: ["/og/builder.jpg"],
  },
};
const page = () => {
  return (
    <div>
      <SolarCalculator />
    </div>
  );
};

export default page;
