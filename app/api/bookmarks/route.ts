import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      select: { toolSlug: true },
    });

    return NextResponse.json(bookmarks.map(b => b.toolSlug));
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { toolSlug } = await req.json();

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_toolSlug: { userId: session.user.id, toolSlug }
      }
    });

    if (existing) {
      // Unbookmark
      await prisma.bookmark.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ message: "Removed", bookmarked: false });
    } else {
      // Bookmark
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          toolSlug,
        }
      });
      return NextResponse.json({ message: "Added", bookmarked: true });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
