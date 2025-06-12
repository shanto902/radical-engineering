// /app/api/revalidate-path/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import directus from "@/lib/directus";
import { updateSingleton } from "@directus/sdk";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || token !== process.env.SECRET_TOKEN)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  // Trigger revalidate
  revalidatePath("/", "layout");

  // Save timestamp (UTC ms)
  const nowTimestamp = Date.now();

  await directus.request(
    updateSingleton("settings", {
      last_revalidate_time: nowTimestamp, // store as number
    })
  );

  console.log(`[REVALIDATE] last_revalidate_time updated to: ${nowTimestamp}`);

  return NextResponse.json({ revalidated: true, now: nowTimestamp });
}
