// app/api/last-order-by-phone/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readItems } from "@directus/sdk";
import directus from "@/lib/directus";

interface Order {
  name: string;
  phone: string;
  address: string;
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    const [latestOrder] = await directus.request<Order[]>(
      readItems("orders", {
        filter: {
          phone: { _eq: phone },
        },
        sort: ["-date_created"],
        limit: 1,
        fields: ["name", "address"],
      })
    );

    if (!latestOrder) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      name: latestOrder.name,
      address: latestOrder.address,
    });
  } catch (err) {
    console.error("Error fetching order by phone:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
