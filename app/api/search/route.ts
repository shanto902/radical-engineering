import { NextRequest, NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { TProduct } from "@/interfaces"; // adjust path as needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  try {
    const products = await directus.request(
      readItems("products", {
        search: query,
        limit: 20,
        fields: [
          "id",
          "name",
          "slug",
          "sku",
          "short_description",
          "price",
          "discounted_price",
          "image",
          "category.slug",
          "category.name",
        ],
      }),
    );

    return NextResponse.json(products as Partial<TProduct>);
  } catch (error) {
    console.error("[Search API Error]:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}
