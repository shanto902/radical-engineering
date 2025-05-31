import { LoadingFallback } from "@/components/common/LoadingFallback";
import SearchPage from "@/components/pages/SearchPage";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Search | Radical Engineering",
  description: "Latest Products from Radical Engineering",
  openGraph: {
    title: "Search | Radical Engineering",
    description: "Latest Products from Radical Engineering",
    images: [
      {
        url: "/og/search.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Search Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search | Radical Engineering",
    description: "Latest Products from Radical Engineering",
    images: ["/og/search.jpg"],
  },
};
const page = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchPage />
    </Suspense>
  );
};

export default page;
