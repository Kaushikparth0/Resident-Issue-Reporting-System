import { db } from "@/db";
import { issues, comments } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, parseInt(id)),
      with: {
        resident: {
          columns: {
            passwordHash: false,
          },
        },
        comments: {
          with: {
            user: {
              columns: {
                passwordHash: false,
              },
            },
          },
          orderBy: [desc(comments.createdAt)],
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Check if resident can view this issue (must be theirs unless admin)
    if (session.user.role === "resident" && issue.residentId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error("Fetch issue error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    const [updatedIssue] = await db
      .update(issues)
      .set({ status, updatedAt: new Date() })
      .where(eq(issues.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("Update issue error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
