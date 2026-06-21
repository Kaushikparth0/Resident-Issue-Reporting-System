import { db } from "@/db";
import { users } from "@/db/schema";
import { encrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, password, role = "resident" } = await request.json();

    const [existingUser] = await db.select().from(users).where(eq(users.email, email));

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      passwordHash,
      role: role as any,
    }).returning();

    // Create session token
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await encrypt({ 
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role, 
        name: newUser.name 
      }, 
      expires 
    });

    // Create response with cookie
    const response = NextResponse.json({ 
      success: true, 
      user: { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name } 
    });

    response.cookies.set("session", session, {
      expires,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
