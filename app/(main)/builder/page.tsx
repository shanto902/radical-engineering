import Link from "next/link";
import { Metadata } from "next";
import React from "react";
import { Columns2, BatteryCharging } from "lucide-react";

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
        url: "/og/builder.jpg",
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

const BuilderPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
        Choose Your System Builder
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Solar System Builder Card */}
        <Link
          href="/builder/solar-system"
          className="flex flex-col items-center justify-between border rounded-lg shadow-lg p-6  hover:shadow-xl transition group"
        >
          <div className="flex items-center justify-center mb-4 animate-pulse">
            <Columns2 className="w-12 h-12 text-yellow-500 group-hover:text-yellow-600 transition" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">
            Solar System Builder
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            Calculate your energy needs and build a complete solar solution for
            your home or office.
          </p>
        </Link>

        {/* IPS System Builder Card */}
        <Link
          href="/builder/ips-system"
          className="flex flex-col items-center justify-between border rounded-lg shadow-lg p-6  hover:shadow-xl transition group"
        >
          <div className="flex items-center justify-center mb-4 animate-pulse">
            <BatteryCharging className="w-12 h-12 text-blue-500 group-hover:text-blue-600 transition" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">
            IPS System Builder
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            Design your ideal IPS backup power system with custom load
            calculations and battery suggestions.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default BuilderPage;
