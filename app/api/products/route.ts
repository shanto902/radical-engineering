// app/api/products/route.ts
import { NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { TProduct } from "@/interfaces";

export async function GET() {
  try {
    const result = await directus.request(
      readItems("products", {
        fields: ["id", "name", "slug", "image", "price", "category.*"],
      })
    );

    return NextResponse.json(result as TProduct[]);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
