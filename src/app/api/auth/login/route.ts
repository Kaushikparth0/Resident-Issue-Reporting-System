import { db } from "@/db";
import { users } from "@/db/schema";
import { encrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log(`[LOGIN] Attempt for: ${email}`);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      console.log(`[LOGIN] User not found: ${email}`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      console.log(`[LOGIN] Password mismatch for: ${email}`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log(`[LOGIN] Success for: ${email} (${user.role})`);

    // Create session token
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await encrypt({ 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        name: user.name 
      }, 
      expires 
    });

    // Create response with cookie
    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, role: user.role, name: user.name } 
    });

    response.cookies.set("session", session, {
      expires,
      httpOnly: true,
      secure: false, // Allow HTTP in development
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGIN] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
