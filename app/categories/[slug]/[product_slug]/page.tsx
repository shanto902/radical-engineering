import ProductPage from "@/components/pages/shop/ProductDetails";
import { fetchProductData } from "@/helper/fetchFromDirectus";
import { TProduct } from "@/interfaces";
import Script from "next/script";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { Metadata } from "next";
import React from "react";
interface PageProps {
  params: Promise<{
    permalink: string;
    slug: string;
    product_slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { product_slug } = await params;
    const product = await fetchProductData(product_slug);

    // If product is found
    if (product) {
      const title = `${product.name} | ${product.category.name} | Radical Engineering`;
      const description =
        product.description ||
        `Buy ${product.name} from Radical Engineering. High quality ${product.category.name} product with fast delivery & warranty in Bangladesh.`;

      // Prepare OG image object array
      const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}categories/${product.category.slug}/${product.slug}/opengraph-image`;

      return {
        title,
        description,
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${product.category.slug}/${product.slug}`,
        },
        openGraph: {
          title,
          description,
          images: ogImageUrl,
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [ogImageUrl],
        },
      };
    }

    // Default metadata if product not found
    return {
      title: "Product Not Found | Radical Engineering",
      description: "This product does not exist.",
    };
  } catch (error) {
    console.error("Error generating product metadata:", error);

    // Return default metadata in case of error
    return {
      title: "Error | Radical Engineering",
      description: "Failed to fetch product metadata.",
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
