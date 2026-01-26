import PaddingContainer from "@/components/common/PaddingContainer";
import CartPage from "@/components/pages/cart/CartPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cart | Radical Engineering",
  description:
    "Review your selected items, update quantities, and proceed to checkout. Secure and hassle-free shopping starts here.",
  openGraph: {
    title: "Cart | Radical Engineering",
    description:
      "Review your selected items, update quantities, and proceed to checkout. Secure and hassle-free shopping starts here.",
    images: [
      {
        url: "/og/cart.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Cart Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cart | Radical Engineering",
    description:
      "Review your selected items, update quantities, and proceed to checkout. Secure and hassle-free shopping starts here.",
    images: ["/og/cart.jpg"],
  },
};
const page = () => {
  return (
    <PaddingContainer>
      <CartPage />
    </PaddingContainer>
  );
};

export default page;
