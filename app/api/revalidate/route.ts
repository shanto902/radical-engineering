import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import directus from "@/lib/directus";
import { updateSingleton } from "@directus/sdk";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || token !== process.env.SECRET_TOKEN)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  revalidatePath("/", "layout");

  const now = new Date().toISOString();

  await directus.request(
    updateSingleton("settings", {
      last_revalidate_time: now,
    })
  );

  console.log(`[REVALIDATE] last_revalidate_time updated to: ${now}`);

  return NextResponse.json({ revalidated: true, now });
}
