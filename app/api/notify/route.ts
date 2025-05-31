// app/api/notify/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message } = body;

    const token = process.env.GOTIFY_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Missing Gotify token" },
        { status: 500 }
      );
    }

    const GOTIFY_URL = `https://notification.atiar.com.bd/message?token=${token}`;

    const gotifyResponse = await fetch(GOTIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        message,
        priority: 5,
      }),
    });

    const data = await gotifyResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
