import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  // If there is no token, return a 401
  if (!token || token !== process.env.SECRET_TOKEN)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
