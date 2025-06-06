import ProductPage from "@/components/pages/shop/ProductDetails";
import { fetchProductData } from "@/helper/fetchFromDirectus";
import { TProduct } from "@/interfaces";
import Script from "next/script";
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
        alternates: {
          canonical: `https://radicalengineering.com.bd/categories/${product.category.slug}/${product.slug}`,
        },
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

    return (result as TProduct[])?.map((item) => ({
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [
      `${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}`,
      ...product.image_gallery.map(
        (img) => `${process.env.NEXT_PUBLIC_ASSETS_URL}${img.directus_files_id}`
      ),
    ],
    description: product.short_description || "",
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "Radical Engineering",
    },
    sku: product.slug,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `https://radicalengineering.com.bd/categories/${product.category.slug}/${product.slug}`,
      priceCurrency: "BDT",
      price: product.discounted_price || product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.status === "in-stock"
          ? "https://schema.org/InStock"
          : product.status === "pre-order"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/OutOfStock",
    },
  };
  return (
    <>
      <Script
        id="product-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <ProductPage product={product} />
    </>
  );
};

export default page;
