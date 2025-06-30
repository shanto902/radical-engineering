import { NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import admin from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.BROADCAST_SECRET}`;

  if (authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, message } = await req.json();

  if (!title || !message) {
    return NextResponse.json(
      { error: "Missing title or message" },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch tokens
    const tokens = await directus.request(
      readItems("device_tokens", { fields: ["token"], limit: -1 })
    );

    const deviceTokens = tokens.map((t) => t.token);

    if (deviceTokens.length === 0) {
      return NextResponse.json(
        { error: "No device tokens found" },
        { status: 404 }
      );
    }

    // 2. Send broadcast
    const response = await admin.messaging().sendEach(
      deviceTokens.map((token) => ({
        token,
        notification: {
          title,
          body: message,
        },
      }))
    );

    return NextResponse.json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
    });
  } catch (err) {
    console.error("Push broadcast error:", err);
    return NextResponse.json(
      { error: "Failed to send push notifications" },
      { status: 500 }
    );
  }
}
