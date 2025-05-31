import ProductPage from "@/components/pages/shop/ProductDetails";
import { fetchProductData } from "@/helper/fetchFromDirectus";
import { TProduct } from "@/interfaces";
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
      return {
        title:
          `${product.name} | ${product.category.name} | Radical Engineering` ||
          "Product not found | Radical Engineering",
        description: `${product.description}` || "Product not found ",
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
      readItems("products", {
        fields: ["slug", "category.slug"],
      })
    );

    return (result as TProduct[]).map((item) => ({
      slug: item.category.slug,
      product_slug: item.slug,
      permalink: "categories",
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
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
