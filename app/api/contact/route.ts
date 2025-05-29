// app/api/contact/route.ts
import { NextResponse } from "next/server";
import directus from "@/lib/directus"; // adjust path if needed
import { createItem } from "@directus/sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, message } = body;

    const result = await directus.request(
      createItem("messages", {
        name,
        phone,
        email,
        message,
      })
    );

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
