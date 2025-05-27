import ShopPage from "@/components/pages/shop/ShopPage";
import { fetchProducts } from "@/helper/fetchFromDirectus";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import React from "react";
interface PageProps {
  params: Promise<{
    permalink: string;
    slug: string;
  }>;
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
  return (
    <div>
      <ShopPage products={products} />
    </div>
  );
};

export default page;
