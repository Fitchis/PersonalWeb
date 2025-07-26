import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import InterviewAnswerClient from "@/app/dashboard/_components/InterviewAnswerClient";
import Navbar from "../../_components/Navbar";

export default async function InterviewDetailPage({
  params,
}: {
  params: { mockId: string };
}) {
  const interview = await prisma.interview.findUnique({
    where: { id: params.mockId },
  });

  if (!interview) return notFound();

  let questions: Array<{ question: string; answer: string }> = [];
  try {
    const parsed = JSON.parse(interview.questionsJson);
    // Jika format sudah benar
    if (
      Array.isArray(parsed) &&
      parsed[0] &&
      (parsed[0].question || parsed[0].pertanyaan)
    ) {
      questions = parsed.map(
        (q: {
          question?: string;
          pertanyaan?: string;
          answer?: string;
          jawaban?: string;
        }) => ({
          question: q.question || q.pertanyaan || JSON.stringify(q),
          answer: q.answer || q.jawaban || "",
        })
      );
    }
  } catch {
    // fallback: tampilkan raw json jika parsing gagal
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Navbar />
      <div className="flex-1">
        {questions.length > 0 ? (
          <InterviewAnswerClient
            questions={questions}
            interviewId={interview.id}
          />
        ) : (
          <pre className="bg-gray-900 text-gray-200 p-4 rounded">
            {interview.questionsJson}
          </pre>
        )}
      </div>
    </div>
  );
}
