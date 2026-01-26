import ShopPage from "@/components/pages/shop/ShopPage";
import { fetchCategories, fetchProducts } from "@/helper/fetchFromDirectus";

import { Metadata, ResolvingMetadata } from "next";
import React from "react";

import { fetchCategoryData } from "@/helper/fetchFromDirectus";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

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

    // "All" Products Page
    if (slug === "all") {
      const title =
        "Shop Solar Panels, Batteries, Inverters, IPS & Accessories | Radical Engineering Bangladesh";
      const description =
        "Browse all products at Radical Engineering: solar panels, batteries, inverters, IPS, and accessories. Affordable prices & fast delivery across Bangladesh.";

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/og/products.jpg`,
              width: 1200,
              height: 630,
              alt: "All Products - Radical Engineering",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og/products.jpg`],
        },
      };
    }

    // Invalid Category Case
    if (!category) {
      return {
        title: "Category Not Found | Radical Engineering",
        description: "This category does not exist.",
      };
    }

    // Dynamic Category Page
    const categoryName = category.name || "Unnamed Category";
    const description =
      category.description ||
      `Shop ${categoryName} at Radical Engineering. Trusted quality, great prices & fast delivery across Bangladesh. Warranty included.`;

    // Prepare OG image object array
    const ogImageObject = category.image
      ? [
          {
            url: `${process.env.NEXT_PUBLIC_ASSETS_URL}${category.image}`,
            alt: `${categoryName} Category Image`,
          },
        ]
      : previousImages;

    // Prepare twitter image string array
    const twitterImages = category.image
      ? [`${process.env.NEXT_PUBLIC_ASSETS_URL}${category.image}`]
      : (previousImages as Array<{ url: string } | string>).map((img) =>
          typeof img === "string" ? img : img.url
        );

    return {
      title: `Buy ${categoryName} Online in Bangladesh | Radical Engineering`,
      description,
      alternates: {
        canonical: `https://www.radicalengineering.com.bd/categories/${category.slug}/`,
      },
      openGraph: {
        title: `Buy ${categoryName} Online in Bangladesh | Radical Engineering`,
        description,
        images: ogImageObject,
      },
      twitter: {
        card: "summary_large_image",
        title: `Buy ${categoryName} Online in Bangladesh | Radical Engineering`,
        description,
        images: twitterImages,
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

const PageShop = async ({ params }: PageProps) => {
  const { slug } = await params;
  const products = await fetchProducts(slug);
  const categories = await fetchCategories();
  return (
    <div>
      <ShopPage products={products} categories={categories} />
    </div>
  );
};

export default PageShop;
