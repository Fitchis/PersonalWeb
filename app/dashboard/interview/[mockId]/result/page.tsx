import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Navbar from "../../../_components/Navbar";

interface ResultPageProps {
  params: Promise<{ mockId: string }>;
}

// Ambil evaluasi AI dari questionsJson, bukan generate baru
function getAIEvaluationFromQuestionObj(
  qObj: { pertanyaan: string; jawaban: string },
  userAnswer: string
) {
  // Jika jawaban kosong atau skip, langsung return kosong
  if (!userAnswer || userAnswer.trim().toLowerCase() === "skip") {
    return {
      aiAnswer: "",
      score: 0,
      explanation: "Jawaban kosong atau skip, skor 0.",
    };
  }
  return {
    aiAnswer: (qObj.jawaban || "").toString(),
    score: 0, // Tidak ada skor, hanya tampilkan jawaban AI
    explanation: "",
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  // Await the params promise
  const { mockId } = await params;

  const interview = await prisma.interview.findUnique({
    where: { id: mockId },
  });
  if (!interview) return notFound();

  // Ambil jawaban user
  const answer = await prisma.interviewAnswer.findFirst({
    where: { interviewId: mockId },
    orderBy: { submittedAt: "desc" },
  });
  let userAnswers: string[] = [];
  if (answer) {
    try {
      userAnswers = JSON.parse(answer.answersJson);
    } catch {}
  }

  // Ambil pertanyaan
  let questions: { pertanyaan: string; jawaban: string }[] = [];
  try {
    const parsed = JSON.parse(interview.questionsJson);
    if (Array.isArray(parsed)) {
      questions = parsed;
    }
  } catch {}

  // Gabungkan data dengan evaluasi AI dari questionsJson
  const results = questions.map((qObj, i) => {
    const userAnswer = userAnswers[i] || "";
    const { aiAnswer, score, explanation } = getAIEvaluationFromQuestionObj(
      qObj,
      userAnswer
    );
    return {
      question: qObj.pertanyaan || "",
      userAnswer,
      aiAnswer,
      score,
      explanation,
    };
  });
  const totalScore = results.reduce(
    (acc, r) => acc + (typeof r.score === "number" ? r.score : 0),
    0
  );
  const maxScore = results.length * 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-700/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gray-600/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gray-800/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      {/* Header Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-8">
        <div className="backdrop-blur-2xl bg-gradient-to-br from-gray-900/40 via-black/40 to-gray-900/20 border border-gray-700/20 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/5 via-transparent to-gray-700/5 rounded-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-xl border border-gray-600/30">
                    <svg
                      className="w-7 h-7 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl blur opacity-20 -z-10"></div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Hasil Interview
                </h1>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl">
                Berikut adalah hasil latihan interview Anda. Bandingkan jawaban
                Anda dengan AI dan lihat skor penilaian.
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-4">
                <div className="flex items-center gap-3 bg-green-900/20 border border-green-800/30 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">
                    Total Skor: {totalScore} / {maxScore}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-800/30 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-400 font-medium">
                    {results.length} Soal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Section */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-20">
        <Accordion type="multiple" className="space-y-6 mt-8">
          {results.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`soal-${idx}`}
              className="border-none"
            >
              <AccordionTrigger className="group backdrop-blur-xl bg-gray-900/40 hover:bg-gray-900/60 border border-gray-700/20 hover:border-gray-600/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center border border-gray-600/30">
                    <span className="text-gray-300 font-bold text-lg">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-gray-300">
                    Soal {idx + 1}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="bg-gray-800/40 border border-gray-700/30 px-3 py-1 rounded-lg text-gray-300 font-bold">
                    Skor: {item.score} / 5
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6">
                <div className="mb-4 text-gray-100">
                  <b className="block mb-1 text-gray-300">Pertanyaan:</b>
                  <span className="bg-gray-800/40 border border-gray-700/30 px-3 py-2 rounded-lg text-lg font-semibold block">
                    {item.question}
                  </span>
                </div>
                <div className="mb-4">
                  <b className="text-green-400 block mb-1">Jawaban Anda:</b>
                  <div className="bg-green-900/15 border border-green-800/25 rounded-lg p-4 text-green-200 whitespace-pre-line text-base">
                    {item.userAnswer || (
                      <i className="text-gray-500">(Belum dijawab)</i>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <b className="text-yellow-400 block mb-1">Jawaban AI:</b>
                  <div className="bg-yellow-900/15 border border-yellow-800/25 rounded-lg p-4 text-yellow-200 whitespace-pre-line text-base">
                    {item.aiAnswer}
                  </div>
                </div>
                {item.explanation && (
                  <div className="mb-4">
                    <b className="text-purple-400 block mb-1">Penjelasan AI:</b>
                    <div className="bg-purple-900/15 border border-purple-800/25 rounded-lg p-4 text-purple-200 whitespace-pre-line text-base">
                      {item.explanation}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
