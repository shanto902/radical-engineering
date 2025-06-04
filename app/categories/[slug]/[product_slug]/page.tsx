import ProductPage from "@/components/pages/shop/ProductDetails";
import { fetchProductData } from "@/helper/fetchFromDirectus";

import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";
interface PageProps {
  params: Promise<{
    permalink: string;
    slug: string;
    product_slug: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { product_slug } = await params;
    const product = await fetchProductData(product_slug);
    const previousImages = (await parent).openGraph?.images || [];

    if (product !== null) {
      const categoryName = product.category?.name || "All Products";
      return {
        title: `${product.name} | ${categoryName} | Radical Engineering`,
        description: product.description || "Product not found",
        openGraph: {
          images: product.image
            ? [
                {
                  url: `${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}`,
                },
              ]
            : [...previousImages],
        },
      };
    }

    return {
      title: "Product not Found",
      description: "This product does not exist.",
    };
  } catch (error) {
    console.error("Error fetching page metadata:", error);
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

    const params = (result as { slug: string }[]).map((item) => ({
      slug: item.slug,
      permalink: "categories",
    }));

    // Add 'all' route explicitly
    return [{ slug: "all", permalink: "categories" }, ...params];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Error generating static params");
  }
};

const page = async ({ params }: PageProps) => {
  const { product_slug } = await params;
  const product = await fetchProductData(product_slug);
  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <div>
      <ProductPage product={product} />
    </div>
  );
};

export default page;
