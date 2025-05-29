/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { TProduct } from "@/interfaces";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const options: any = {
      fields: ["*", "category.*", "brand.*"],
    };

    if (category) {
      options.filter = {
        category: {
          slug: { _eq: category },
        },
      };
    }

    const result = await directus.request(readItems("products", options));
    return NextResponse.json(result as TProduct[]);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
