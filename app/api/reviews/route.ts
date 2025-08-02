// /app/api/reviews/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://featurable.com/api/v2/widgets/8f46be43-b855-4151-b5d7-4b4cc943d027",
      {
        headers: {
          // Optional: Add headers here if Featurable requires an API key
          // Authorization: `Bearer ${process.env.FEATURABLE_API_KEY}`,
        },
        next: { revalidate: 3600 }, // Optional: ISR caching for 1 hour
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Featurable API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
