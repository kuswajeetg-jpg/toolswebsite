import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, mobile, welcomeMessage } = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        mobile,
        welcomeMessage,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
