"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import QuestionsSection from "./QuestionsSection";
import RecordAnswerSection from "./RecordAnswerSection";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import useMediaStream from "@/hooks/useMediaStream";
import useRecordingTimer from "@/hooks/useRecordingTimer";

type QA = { question: string; answer: string };

interface Props {
  questions: QA[];
  interviewId: string;
}

export default function InterviewAnswerClient(props: Props) {
  const { questions, interviewId } = props;
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(() =>
    Array(questions.length).fill("")
  );
  const [liveTranscripts, setLiveTranscripts] = useState<string[]>(() =>
    Array(questions.length).fill("")
  );
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  // Custom hooks
  const { startRecognition, stopRecognition } = useSpeechRecognition();
  const { mediaStreams, getMediaStream, stopStream, stopAllStreams } =
    useMediaStream(1);
  const { recordingTime, startTimer, stopTimer } = useRecordingTimer();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lanjut ke soal berikutnya
  const handleNext = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((idx) => idx + 1);
    } else {
      // Submit all answers ke backend
      if (!interviewId) {
        alert("interviewId tidak ditemukan. Tidak bisa submit jawaban.");
        return;
      }
      console.log("Submit interviewId:", interviewId, "answers:", userAnswers);
      try {
        const res = await fetch("/api/interview/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interviewId,
            answers: userAnswers,
            submittedAt: new Date().toISOString(),
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          alert("Gagal menyimpan jawaban: " + (data.error || res.status));
        } else {
          // Redirect ke halaman hasil interview
          router.push(`/dashboard/interview/${interviewId}/result`);
        }
      } catch (err) {
        alert(
          "Gagal submit jawaban: " + (err instanceof Error ? err.message : err)
        );
      }
    }
  }, [
    currentQuestionIndex,
    questions.length,
    interviewId,
    userAnswers,
    router,
  ]);

  // Stop recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setTranscribing(true);
    stopRecognition();
    stopStream(0);
    stopTimer();
    setTimeout(() => setTranscribing(false), 1000);
  }, [stopRecognition, stopStream, stopTimer]);

  // Pindah soal
  const goToQuestion = useCallback(
    (idx: number) => {
      if (isRecording) {
        stopRecording();
      }
      setCurrentQuestionIndex(idx);
      setIsRecording(false);
      setTranscribing(false);
      stopTimer();
      stopAllStreams();
    },
    [isRecording, stopAllStreams, stopRecording, stopTimer]
  );

  // Mulai rekam
  const startRecording = useCallback(async () => {
    try {
      setIsRecording(true);
      setTranscribing(false);
      setLiveTranscripts((prev) => {
        const arr = [...prev];
        arr[currentQuestionIndex] = "";
        return arr;
      });
      setUserAnswers((prev) => {
        const arr = [...prev];
        arr[currentQuestionIndex] = "";
        return arr;
      });
      startTimer();
      const stream = await getMediaStream(0);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      startRecognition(
        (transcript) =>
          setLiveTranscripts((prev) => {
            const arr = [...prev];
            arr[currentQuestionIndex] = transcript;
            return arr;
          }),
        (finalTranscript) => {
          setIsRecording(false);
          setTranscribing(true);
          setUserAnswers((prev) => {
            const arr = [...prev];
            arr[currentQuestionIndex] = finalTranscript;
            return arr;
          });
          setLiveTranscripts((prev) => {
            const arr = [...prev];
            arr[currentQuestionIndex] = "";
            return arr;
          });
          stopStream(0);
          stopTimer();
          setTimeout(() => setTranscribing(false), 1000);
        }
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memulai recording"
      );
      setIsRecording(false);
      stopTimer();
    }
  }, [
    startTimer,
    getMediaStream,
    startRecognition,
    currentQuestionIndex,
    stopStream,
    stopTimer,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecognition();
      stopTimer();
      stopAllStreams();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===================== Render =====================
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Questions Section */}
      <div className="w-1/3 min-w-[320px] max-w-[400px] p-6 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-white/10">
        <QuestionsSection
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          completedQuestions={userAnswers.map((ans) => !!ans)}
          goToQuestion={goToQuestion}
          isRecording={isRecording}
          recordingIndex={0}
        />
      </div>

      {/* Right Side - Recording Section */}
      <div className="flex-1 p-6 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="h-full flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <RecordAnswerSection
              question={questions[currentQuestionIndex]?.question}
              userAnswer={userAnswers[currentQuestionIndex]}
              liveTranscript={liveTranscripts[currentQuestionIndex]}
              onNextQuestion={handleNext}
              isLast={currentQuestionIndex === questions.length - 1}
              isRecording={isRecording}
              transcribing={transcribing}
              recordingTime={recordingTime}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onRetry={startRecording}
              videoRef={videoRef}
              mediaStream={mediaStreams[0]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
