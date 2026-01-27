import { NextRequest, NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItem } from "@directus/sdk";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "User ID is required" },
      { status: 400 },
    );
  }

  try {
    const user = await directus.request(
      readItem("students", id, { fields: ["status"] }),
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, status: user.status });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user status" },
      { status: 500 },
    );
  }
}
