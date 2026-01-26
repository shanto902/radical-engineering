import WishlistPage from "@/components/pages/wishlist/WishlistPage";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Wish List | Radical Engineering",
  description:
    "View and manage your saved products in one place. Easily add items to your cart or keep track of your favorite picks for later.",
  openGraph: {
    title: "Wish List | Radical Engineering",
    description:
      "View and manage your saved products in one place. Easily add items to your cart or keep track of your favorite picks for later.",
    images: [
      {
        url: "/og/wishlist.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Products Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wish List | Radical Engineering",
    description:
      "View and manage your saved products in one place. Easily add items to your cart or keep track of your favorite picks for later.",
    images: ["/og/wishlist.jpg"],
  },
};
const page = () => {
  return <WishlistPage />;
};

export default page;
