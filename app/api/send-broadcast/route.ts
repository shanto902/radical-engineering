import { NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY!;

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
    // 1. Get all device tokens from Directus
    const tokens = await directus.request(
      readItems("device_tokens", { fields: ["token"], limit: -1 })
    );

    // 2. Prepare fetch POST requests to FCM
    const requests = tokens.map((t) =>
      fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization: `key=${FCM_SERVER_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: t.token,
          notification: {
            title,
            body: message,
          },
        }),
      })
    );

    // 3. Execute all in parallel
    const results = await Promise.allSettled(requests);

    return NextResponse.json({
      success: true,
      sent: results.filter((r) => r.status === "fulfilled").length,
    });
  } catch (err) {
    console.error("Push broadcast error:", err);
    return NextResponse.json(
      { error: "Failed to send push notifications" },
      { status: 500 }
    );
  }
}
