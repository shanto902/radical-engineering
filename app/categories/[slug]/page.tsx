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

    if (slug === "all") {
      const title = "All Products | Radical Engineering";
      const description =
        "Browse all available products from Radical Engineering.";

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL}og/products.jpg`, // Ensure this path is public (inside the `public` directory)
              width: 1200,
              height: 630,
              alt: "Checkout Cover - Radical Engineering",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [`${process.env.NEXT_PUBLIC_SITE_URL}og/products.jpg`],
        },
      };
    }

    if (!category) {
      return {
        title: "Category Not Found | Radical Engineering",
        description: "This category does not exist.",
      };
    }

    const categoryName = category.name || "Unnamed Category";
    const description =
      category.description ||
      `Browse products in the ${categoryName} category.`;

    return {
      title: `${categoryName} | Category | Radical Engineering`,
      description,
      alternates: {
        canonical: `https://radicalengineering.com.bd/categories/${category.slug}/`,
      },
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
