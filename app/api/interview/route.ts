import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      mockId,
      jsonMockResponse,
      jobPosition,
      jobDescription,
      jobExperience,
      createdAt,
    } = body;

    const interview = await prisma.interview.create({
      data: {
        id: mockId,
        userId: user.id,
        questionsJson: jsonMockResponse,
        jobPosition,
        jobDescription,
        jobExperience,
        createdAt: new Date(createdAt),
      },
    });

    return NextResponse.json({ success: true, interview });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
