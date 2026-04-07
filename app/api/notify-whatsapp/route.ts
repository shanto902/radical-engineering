import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, address, items, total } = body;

    const whatsappMessage = `*New Order Received!*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}\n\n*Order Items:*\n${items
      ?.map((item: any) => `- ${item.name} x${item.quantity}`)
      .join("\n")}\n\n*Total:* ${
      total ? total.toLocaleString() : 0
    } BDT`;

    const WAHA_API_URL = process.env.WAHA_API_URL; // e.g. http://localhost:3000/api/sendText
    const WAHA_SESSION = process.env.WAHA_SESSION || "default";
    const WAHA_API_KEY = process.env.WAHA_API_KEY; // The API key from your WAHA setup
    const ADMIN_PHONES = ["8801787224460", "8801760195100"];

    if (!WAHA_API_URL) {
      console.warn("WAHA_API_URL missing in .env, skipping notification.");
      return NextResponse.json({ success: true, warning: "Missing WAHA Credentials" });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (WAHA_API_KEY) {
      headers["x-api-key"] = WAHA_API_KEY;
    }

    const notifications = ADMIN_PHONES.map(async (phone) => {
      const response = await fetch(WAHA_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          chatId: `${phone.trim()}@c.us`,
          text: whatsappMessage,
          session: WAHA_SESSION,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`WAHA Error for ${phone}: ${errorText}`);
        throw new Error(`WAHA Error for ${phone}: ${errorText}`);
      }
      return phone;
    });

    await Promise.allSettled(notifications);

    return NextResponse.json({ success: true, message: "Sent via WAHA" });
  } catch (error) {
    console.error("WhatsApp Notification Error:", error);
    // Return 200 so the frontend checkout process doesn't completely fail if this notification fails
    return NextResponse.json({ success: false, error: "Notification Failed" });
  }
}
