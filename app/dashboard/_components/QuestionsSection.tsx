import React from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

type QuestionsSectionProps = {
  questions: { question: string; answer: string }[];
  currentQuestionIndex: number;
  completedQuestions: boolean[];
  goToQuestion: (idx: number) => void;
  isRecording?: boolean;
  recordingIndex?: number | null;
};

export default function QuestionsSection({
  questions,
  currentQuestionIndex,
  completedQuestions,
  goToQuestion,
  isRecording = false,
  recordingIndex = null,
}: QuestionsSectionProps) {
  const completedCount = completedQuestions.filter(Boolean).length;
  const totalQuestions = questions.length;
  const progressPercentage = (completedCount / totalQuestions) * 100;

  const getQuestionStatus = (idx: number) => {
    if (recordingIndex === idx && isRecording) {
      return {
        icon: <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />,
        color: "bg-red-500/20 border-red-500/30 text-red-300",
        label: "Merekam",
      };
    }
    if (completedQuestions[idx]) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        color: "bg-green-500/20 border-green-500/30 text-green-300",
        label: "Selesai",
      };
    }
    if (currentQuestionIndex === idx) {
      return {
        icon: idx + 1,
        color:
          "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-transparent",
        label: "Aktif",
      };
    }
    return {
      icon: idx + 1,
      color: "bg-white/5 text-gray-400 hover:bg-white/10 border-transparent",
      label: "Belum dijawab",
    };
  };

  const canNavigate = (idx: number) => {
    // Prevent navigation while recording unless it's to the current recording question
    return !isRecording || recordingIndex === idx;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Pertanyaan Interview
        </h3>
        <div className="text-sm text-gray-300">
          {completedCount} dari {totalQuestions} selesai
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Recording Warning */}
      {isRecording && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-300 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Sedang merekam jawaban...</span>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-2">
        {questions.map((question, idx) => {
          const status = getQuestionStatus(idx);
          const isClickable = canNavigate(idx);

          return (
            <div key={idx} className="relative">
              <button
                type="button"
                onClick={() => isClickable && goToQuestion(idx)}
                disabled={!isClickable}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 border ${
                  status.color
                } ${
                  !isClickable
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                }`}
                title={
                  !isClickable
                    ? "Tidak dapat berpindah saat merekam"
                    : `Pergi ke ${status.label.toLowerCase()}`
                }
              >
                {/* Question Number/Status Icon */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    completedQuestions[idx]
                      ? "bg-green-500 text-white"
                      : currentQuestionIndex === idx
                        ? "bg-white/20"
                        : "bg-gray-600 text-white"
                  }`}
                >
                  {status.icon}
                </div>

                {/* Question Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Soal {idx + 1}</span>
                    {recordingIndex === idx && isRecording && (
                      <Clock className="w-3 h-3 text-red-400 animate-pulse" />
                    )}
                  </div>
                  {/* Question Preview */}
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    {question.question.length > 50
                      ? `${question.question.substring(0, 50)}...`
                      : question.question}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-end">
                  {currentQuestionIndex === idx && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  )}
                </div>
              </button>

              {/* Current Question Indicator */}
              {currentQuestionIndex === idx && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-green-500/10">
            <div className="text-lg font-bold text-green-400">
              {completedCount}
            </div>
            <div className="text-xs text-gray-400">Selesai</div>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10">
            <div className="text-lg font-bold text-blue-400">1</div>
            <div className="text-xs text-gray-400">Aktif</div>
          </div>
          <div className="p-2 rounded-lg bg-gray-500/10">
            <div className="text-lg font-bold text-gray-400">
              {totalQuestions - completedCount - 1}
            </div>
            <div className="text-xs text-gray-400">Tersisa</div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>Klik soal untuk berpindah</span>
        </div>
      </div>
    </div>
  );
}
