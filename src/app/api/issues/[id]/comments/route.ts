import { db } from "@/db";
import { comments } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await request.json();

    const [newComment] = await db.insert(comments).values({
      issueId: parseInt(id),
      userId: session.user.id,
      content,
    }).returning();

    const commentWithUser = await db.query.comments.findFirst({
      where: (comments, { eq }) => eq(comments.id, newComment.id),
      with: {
        user: {
          columns: {
            passwordHash: false,
          },
        },
      },
    });

    return NextResponse.json(commentWithUser);
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
