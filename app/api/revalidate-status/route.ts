import { readSingleton } from "@directus/sdk";
import { NextResponse } from "next/server";
import directus from "@/lib/directus";

export async function GET() {
  try {
    const settings = await directus.request(readSingleton("settings"));

    const lastRevalidateTime = settings.last_revalidate_time ?? null;

    return NextResponse.json({
      lastRevalidateTime,
    });
  } catch (error) {
    console.error("Error reading revalidate status:", error);
    return NextResponse.json(
      { error: "Failed to read revalidate status" },
      { status: 500 }
    );
  }
}
