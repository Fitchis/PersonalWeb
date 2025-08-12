import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { generateText } from "@/lib/server-gemini";
import { ipFromRequestHeaders, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { jobPosition, jobDescription, jobExperience } = await req.json();
    // Rate limit by IP
    const ip = ipFromRequestHeaders(req.headers);
    const rl = rateLimit("interview-generate", ip, { max: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": Math.ceil((rl.resetAt - Date.now()) / 1000).toString() } }
      );
    }
    if (!jobPosition || !jobDescription) {
      return NextResponse.json(
        { error: "jobPosition and jobDescription are required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const prompt = `Posisi Pekerjaan: ${jobPosition}, Deskripsi Pekerjaan: ${jobDescription}, Pengalaman Kerja (tahun): ${jobExperience}. Berdasarkan informasi ini, buatkan 5 pertanyaan interview beserta jawabannya dalam format JSON berbahasa Indonesia.`;
    const reply = await generateText([{ role: "user", content: prompt }]);
    const cleaned = reply.replace(/```json|```/g, "").trim();
    // validate JSON minimally
    JSON.parse(cleaned);

    const id = uuidv4();
    const created = await prisma.interview.create({
      data: {
        id,
        userId: user.id,
        questionsJson: cleaned,
        jobPosition,
        jobDescription,
        jobExperience: String(jobExperience ?? ""),
      },
    });

    return NextResponse.json({ success: true, interview: created });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
