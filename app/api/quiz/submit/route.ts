import { NextRequest, NextResponse } from "next/server";
import directus from "@/lib/directus";
import { createItem } from "@directus/sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student, quiz, score, total_marks, percentage, answers, status } =
      body;

    // Basic validation
    if (!student || !quiz) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Save to Directus
    const result = await directus.request(
      createItem("quiz_results", {
        student,
        quiz,
        score,
        total_marks,
        percentage,
        answers, // This should be a JSON object
        status: status || "completed",
      }),
    );

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit quiz" },
      { status: 500 },
    );
  }
}
