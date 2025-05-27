import { NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

export async function GET() {
  try {
    const categories = await directus.request(
      readItems("categories", {
        fields: ["name", "slug"],
      })
    );
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
