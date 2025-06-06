import { readSingleton } from "@directus/sdk";
import { NextResponse } from "next/server";
import directus from "@/lib/directus"; // your existing Directus client with .with(rest())

export async function GET() {
  try {
    // Read the singleton "global_settings"
    const settings = await directus.request(readSingleton("settings"));

    return NextResponse.json({
      lastRevalidateTime: settings.last_revalidate_time,
    });
  } catch (error) {
    console.error("Error reading revalidate status:", error);
    return NextResponse.json(
      { error: "Failed to read revalidate status" },
      { status: 500 }
    );
  }
}
