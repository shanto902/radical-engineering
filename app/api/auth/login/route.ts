import { NextRequest, NextResponse } from "next/server";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Identifier and password are required" },
        { status: 400 }
      );
    }

    // Find user with matching credentials (Email or Phone)
    const users = await directus.request(
      readItems("students", {
        filter: {
          _or: [
              { email: { _eq: identifier } },
              { phone: { _eq: identifier } }
          ]
        },
        fields: ["id", "email", "phone", "name", "password"], // Need password to verify
      })
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Check password
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: "Invalid username or password" },
          { status: 401 }
        );
    }

    // Remove password from response
    // @ts-ignore
    delete user.password;
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
