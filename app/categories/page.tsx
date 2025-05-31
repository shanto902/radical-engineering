import ShopPage from "@/components/pages/shop/ShopPage";
import { fetchCategories, fetchProducts } from "@/helper/fetchFromDirectus";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Products | Radical Engineering",
  description: "Latest Products from Radical Engineering",
  openGraph: {
    title: "Products | Radical Engineering",
    description: "Latest Products from Radical Engineering",
    images: [
      {
        url: "/og/products.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Products Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Products | Radical Engineering",
    description: "Latest Products from Radical Engineering",
    images: ["/og/products.jpg"],
  },
};

const page = async () => {
  const products = await fetchProducts();
  const categories = await fetchCategories();
  return (
    <div>
      <ShopPage products={products} categories={categories} />
    </div>
  );
};

export default page;
