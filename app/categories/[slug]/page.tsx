import ShopPage from "@/components/pages/shop/ShopPage";
import {
  fetchCategories,
  fetchCategoryData,
  fetchProducts,
} from "@/helper/fetchFromDirectus";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";
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

    if (category !== null) {
      return {
        title:
          `${category.name} | Category | Radical Engineering` ||
          "Category not found | Radical Engineering",
        description: `${category.description}` || "Category not found ",
        openGraph: {
          images: category.image
            ? [
                {
                  url: `${process.env.NEXT_PUBLIC_ASSETS_URL}${category.image}`,
                },
              ]
            : [...previousImages],
        },
      };
    }

    // Default metadata if the page is not found
    return {
      title: "Category not Found",
      description: "This page does not exist.",
    };
  } catch (error) {
    console.error("Error fetching page metadata:", error);

    // Return default metadata in case of error
    return {
      title: "Error",
      description: "Failed to fetch page metadata.",
    };
  }
}

export const generateStaticParams = async () => {
  try {
    const result = await directus.request(
      readItems("categories", {
        fields: ["slug"],
      })
    );

    return (result as { slug: string }[]).map((item) => ({
      slug: item.slug,
      permalink: "categories",
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Error generating static params");
  }
};
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
