import { db } from "@/db";
import { issues } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let result;
    if (session.user.role === "admin") {
      result = await db.query.issues.findMany({
        with: {
          resident: {
            columns: {
              passwordHash: false,
            },
          },
        },
        orderBy: [desc(issues.createdAt)],
      });
    } else {
      result = await db.query.issues.findMany({
        where: eq(issues.residentId, session.user.id),
        orderBy: [desc(issues.createdAt)],
      });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch issues error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== "resident") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, category } = await request.json();

    const [newIssue] = await db.insert(issues).values({
      title,
      description,
      category,
      residentId: session.user.id,
    }).returning();

    return NextResponse.json(newIssue);
  } catch (error) {
    console.error("Create issue error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
