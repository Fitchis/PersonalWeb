import React, { useEffect, useState } from "react";
import {
  Play,
  Square,
  RotateCcw,
  Mic,
  CheckCircle,
  Video,
  Clock,
  MicOff,
  VideoOff,
  AlertCircle,
} from "lucide-react";

interface RecordAnswerSectionProps {
  question: string;
  userAnswer: string;
  liveTranscript: string;
  isRecording: boolean;
  transcribing: boolean;
  recordingTime: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onRetry: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mediaStream: MediaStream | null;
  onNextQuestion: () => void;
  isLast: boolean;
}

export default function RecordAnswerSection({
  question,
  userAnswer,
  liveTranscript,
  isRecording,
  transcribing,
  recordingTime,
  onStartRecording,
  onStopRecording,
  onRetry,
  videoRef,
  mediaStream,
  onNextQuestion,
  isLast,
}: RecordAnswerSectionProps) {
  const [videoError, setVideoError] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get recording status
  const getRecordingStatus = () => {
    if (isRecording)
      return {
        text: "Merekam",
        color: "bg-red-500",
        icon: <div className="w-2 h-2 bg-white rounded-full animate-pulse" />,
      };
    if (transcribing)
      return { text: "Memproses...", color: "bg-yellow-500", icon: null };
    if (userAnswer)
      return {
        text: "Selesai",
        color: "bg-green-500",
        icon: <CheckCircle className="w-3 h-3" />,
      };
    return { text: "Siap Merekam", color: "bg-gray-700", icon: null };
  };

  // Check media stream capabilities
  useEffect(() => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      const videoTracks = mediaStream.getVideoTracks();

      setHasAudio(audioTracks.length > 0 && audioTracks[0].enabled);
      setHasVideo(videoTracks.length > 0 && videoTracks[0].enabled);
    }
  }, [mediaStream]);

  // Handle video errors
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleError = () => setVideoError(true);
      const handleLoadStart = () => setVideoError(false);

      videoElement.addEventListener("error", handleError);
      videoElement.addEventListener("loadstart", handleLoadStart);

      return () => {
        videoElement.removeEventListener("error", handleError);
        videoElement.removeEventListener("loadstart", handleLoadStart);
      };
    }
  }, [videoRef]);

  const status = getRecordingStatus();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      {/* Question Display */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl border border-blue-500/30">
        <p className="text-white text-lg leading-relaxed">{question}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Preview Section */}
        <div className="flex-1">
          <div className="aspect-video bg-black rounded-xl overflow-hidden relative border-2 border-gray-700">
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ display: mediaStream && !videoError ? "block" : "none" }}
            />

            {/* Placeholder when no video */}
            {(!mediaStream || videoError) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  {videoError ? (
                    <>
                      <AlertCircle className="w-16 h-16 mx-auto mb-2 opacity-50 text-red-400" />
                      <p>Gagal memuat video</p>
                    </>
                  ) : (
                    <>
                      <Video className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p>Video akan muncul saat merekam</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Status Overlay */}
            <div className="absolute top-4 left-4">
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${status.color} ${
                  status.color === "bg-yellow-500" ? "text-black" : "text-white"
                }`}
              >
                {status.icon}
                {status.text}
              </div>
            </div>

            {/* Recording Timer */}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 text-red-400 animate-pulse">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">
                  {formatTime(recordingTime)}
                </span>
              </div>
            )}

            {/* Media Status Indicators */}
            {mediaStream && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                <div
                  className={`p-2 rounded-full ${hasAudio ? "bg-green-500/80" : "bg-red-500/80"}`}
                >
                  {hasAudio ? (
                    <Mic className="w-4 h-4 text-white" />
                  ) : (
                    <MicOff className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`p-2 rounded-full ${hasVideo ? "bg-green-500/80" : "bg-red-500/80"}`}
                >
                  {hasVideo ? (
                    <Video className="w-4 h-4 text-white" />
                  ) : (
                    <VideoOff className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Warning Messages */}
          {mediaStream && (!hasAudio || !hasVideo) && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  {!hasAudio && !hasVideo && "Mikrofon dan kamera tidak aktif"}
                  {!hasAudio && hasVideo && "Mikrofon tidak aktif"}
                  {hasAudio && !hasVideo && "Kamera tidak aktif"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="lg:w-80 space-y-4">
          <div className="bg-black/30 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3">Kontrol Rekaman</h4>
            <div className="space-y-3">
              {/* Main Recording Button */}
              <button
                type="button"
                className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                }`}
                onClick={isRecording ? onStopRecording : onStartRecording}
                disabled={transcribing}
              >
                {transcribing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : isRecording ? (
                  <>
                    <Square className="w-5 h-5" /> Stop Rekam
                  </>
                ) : userAnswer ? (
                  <>
                    <RotateCcw className="w-5 h-5" /> Ulangi Jawaban
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" /> Mulai Rekam
                  </>
                )}
              </button>

              {/* Retry Button (separate from main button when answer exists) */}
              {userAnswer && !isRecording && !transcribing && (
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  onClick={onRetry}
                >
                  <RotateCcw className="w-4 h-4" />
                  Rekam Ulang
                </button>
              )}

              {/* Success Indicator */}
              {userAnswer && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Jawaban tersimpan</span>
                </div>
              )}

              {/* Recording Info */}
              <div className="text-xs text-gray-400 space-y-1">
                <p>• Maksimal 2 menit per jawaban</p>
                <p>• Pastikan mikrofon dan kamera aktif</p>
                <p>• Berbicara dengan jelas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Transcript Section */}
      {(liveTranscript || userAnswer) && (
        <div className="bg-black/40 rounded-xl p-4 border border-gray-600 mt-6">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <Mic className="w-4 h-4" />
            {liveTranscript ? "Transkrip Real-time" : "Jawaban Tersimpan"}
          </h4>
          <div
            className={`p-4 rounded-lg min-h-[60px] ${
              liveTranscript
                ? "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30"
                : "bg-green-500/20 text-green-200 border border-green-500/30"
            }`}
          >
            <p className="leading-relaxed">
              {liveTranscript ||
                userAnswer ||
                "Mulai berbicara untuk melihat transkrip..."}
            </p>
            {liveTranscript && (
              <div className="mt-2 flex items-center gap-1 text-yellow-300">
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                <span className="text-xs">Mendengarkan...</span>
              </div>
            )}
          </div>
          {/* Tombol Lanjut/Selesai */}
          {userAnswer && !isRecording && !transcribing && (
            <button
              type="button"
              className="mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              onClick={onNextQuestion}
            >
              {isLast ? "Selesai" : "Lanjut"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
