import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { message, rating } = await req.json();

    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        message,
        rating,
        userId: session?.user?.id || null, // allow anonymous feedback if not logged in
      },
    });

    return NextResponse.json({ message: "Feedback submitted successfully", feedback }, { status: 201 });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ message: "Error submitting feedback" }, { status: 500 });
  }
}
