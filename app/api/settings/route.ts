// /app/api/settings/route.ts
import { readSingleton } from "@directus/sdk";
import directus from "@/lib/directus";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await directus.request(readSingleton("settings"));
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
