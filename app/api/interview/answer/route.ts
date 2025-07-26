import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { interviewId, answers, submittedAt } = await req.json();
    if (!interviewId || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Simpan jawaban ke tabel baru InterviewAnswer
    const saved = await prisma.interviewAnswer.create({
      data: {
        interviewId,
        answersJson: JSON.stringify(answers),
        submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
      },
    });
    return NextResponse.json({ success: true, id: saved.id });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
