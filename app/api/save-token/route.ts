import { NextResponse } from "next/server";
import directus from "@/lib/directus";
import { createItem, readItems } from "@directus/sdk";

export async function POST(req: Request) {
  try {
    const { token, platform } = await req.json();

    if (!token || !platform) {
      return NextResponse.json(
        { error: "Missing token or platform" },
        { status: 400 }
      );
    }

    // Check if token already exists
    const existing = await directus.request(
      readItems("device_tokens", {
        filter: { token: { _eq: token } },
        fields: ["id"],
        limit: 1,
      })
    );

    if (existing.length === 0) {
      await directus.request(createItem("device_tokens", { token, platform }));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Token save failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
