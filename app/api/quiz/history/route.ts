import { NextRequest, NextResponse } from "next/server";
import { fetchQuizResults } from "@/helper/fetchFromDirectus";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing User ID" },
        { status: 400 },
      );
    }

    const results = await fetchQuizResults(userId);

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Error fetching quiz history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
