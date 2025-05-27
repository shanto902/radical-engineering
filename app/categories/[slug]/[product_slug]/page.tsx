import ProductPage from "@/components/pages/shop/ProductDetails";
import { fetchProductData } from "@/helper/fetchFromDirectus";
import { TProduct } from "@/interfaces";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import React from "react";
interface PageProps {
  params: Promise<{
    permalink: string;
    slug: string;
    product_slug: string;
  }>;
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
      {" "}
      <ProductPage product={product} />
    </div>
  );
};

export default page;
