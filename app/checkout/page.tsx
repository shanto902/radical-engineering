import PaddingContainer from "@/components/common/PaddingContainer";
import CheckoutPage from "@/components/pages/CheckoutPage";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Checkout | Radical Engineering",
  description: "Checkout page of Radical Engineering",
  openGraph: {
    title: "Checkout | Radical Engineering",
    description: "Checkout page of Radical Engineering",
    images: [
      {
        url: "/og/checkout.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Checkout Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout | Radical Engineering",
    description: "Checkout page of Radical Engineering",
    images: ["/og/checkout.jpg"],
  },
};
const page = () => {
  return (
    <PaddingContainer>
      <CheckoutPage />
    </PaddingContainer>
  );
};

export default page;
