/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

export async function GET(req: Request) {
  try {
    const notifications = await directus.request(
      readItems("push_requests", {
        sort: ["-date_created"],
        fields: ["id", "title", "message", "route", "date_created"],
      })
    );

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("Notifications API error:", err);
    return NextResponse.json({ notifications: [] });
  }
}
