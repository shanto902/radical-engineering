import { NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

export async function GET() {
  try {
    const projects = await directus.request(
      readItems("projects", {
        fields: ["title", "slug"],
      })
    );
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching project slugs:", error);
    return NextResponse.json(
      { error: "Failed to fetch project data" },
      { status: 500 }
    );
  }
}
