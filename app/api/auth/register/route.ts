import { NextRequest, NextResponse } from "next/server";
import directus from "@/lib/directus";
import { createItem, readItems } from "@directus/sdk";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, phone, password, name, address } = await req.json();

    if (!email || !phone || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists (Email or Phone)
    const existingUsers = await directus.request(
      readItems("students", {
        filter: {
           _or: [
               { email: { _eq: email } },
               { phone: { _eq: phone } }
           ]
        },
      })
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return NextResponse.json(
            { success: false, error: "User with this email or phone already exists" },
            { status: 409 }
        );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await directus.request(
      createItem("students", {
        email,
        phone,
        password: hashedPassword, 
        name,
        address,
        username: email, // Optional: if username is required by Directus, map it to email. Otherwise remove.
        status: "published"
      })
    );

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
