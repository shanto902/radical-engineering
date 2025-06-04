import ShopPage from "@/components/pages/shop/ShopPage";
import { fetchCategories, fetchProducts } from "@/helper/fetchFromDirectus";

import { Metadata, ResolvingMetadata } from "next";
import React from "react";

import { fetchCategoryData } from "@/helper/fetchFromDirectus";

interface PageProps {
  params: Promise<{
    permalink: string;
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const category = await fetchCategoryData(slug);
    const previousImages = (await parent).openGraph?.images || [];

    if (!category) {
      return {
        title: "Category Not Found | Radical Engineering",
        description: "This category does not exist.",
      };
    }

    const categoryName = category.name || "All Products";
    const description =
      category.description ||
      `Browse products in the ${categoryName} category.`;

    return {
      title: `${categoryName} | Category | Radical Engineering`,
      description,
      openGraph: {
        title: `${categoryName} | Radical Engineering`,
        description,
        images: category.image
          ? [
              {
                url: `${process.env.NEXT_PUBLIC_ASSETS_URL}${category.image}`,
                alt: `${categoryName} Category Image`,
              },
            ]
          : previousImages,
      },
      twitter: {
        card: "summary_large_image",
        title: `${categoryName} | Radical Engineering`,
        description,
        images: category.image
          ? [`${process.env.NEXT_PUBLIC_ASSETS_URL}${category.image}`]
          : [],
      },
    };
  } catch (error) {
    console.error("Error generating category metadata:", error);

    return {
      title: "Error | Radical Engineering",
      description: "Failed to generate metadata for this category.",
    };
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const products = await fetchProducts(slug);
  const categories = await fetchCategories();
  return (
    <div>
      <ShopPage products={products} categories={categories} />
    </div>
  );
};

export default page;
