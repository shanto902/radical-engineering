import { NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import admin from "@/lib/firebaseAdmin";

// Define the expected structure for incoming JSON
interface BroadcastRequest {
  title: string;
  message: string;
  route?: string;
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.BROADCAST_SECRET}`;

  if (authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: BroadcastRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, message, route } = body;

  if (!title || !message) {
    return NextResponse.json(
      { error: "Missing title or message" },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch all device tokens from Directus
    const tokens = await directus.request(
      readItems("device_tokens", {
        fields: ["token"],
        limit: -1,
      })
    );

    const deviceTokens = [
      ...new Set(tokens.map((t) => t.token).filter(Boolean)),
    ];

    if (deviceTokens.length === 0) {
      return NextResponse.json(
        { error: "No device tokens found" },
        { status: 404 }
      );
    }

    // 2. Send push notifications with FCM
    const response = await admin.messaging().sendEach(
      deviceTokens.map((token) => ({
        token,
        notification: {
          title,
          body: message,
        },
        data: {
          route: route || "/notifications", // default route fallback
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
