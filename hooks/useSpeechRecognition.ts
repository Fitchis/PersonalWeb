import { useRef, useCallback } from "react";

const useSpeechRecognition = () => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecognition = useCallback(
    (
      onResult: (transcript: string, isInterim: boolean) => void,
      onEnd: (finalTranscript: string) => void
    ) => {
      const SpeechRecognition =
        (window as Window & typeof globalThis).SpeechRecognition ||
        (window as Window & typeof globalThis).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        throw new Error("SpeechRecognition API tidak didukung di browser ini.");
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.continuous = true;
      recognition.interimResults = true;

      let finalTranscript = "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let currentFinal = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        finalTranscript += currentFinal;
        onResult(
          finalTranscript + interimTranscript,
          interimTranscript.length > 0
        );
      };

      recognition.onend = () => {
        onEnd(finalTranscript.trim());
      };

      recognition.onerror = (event: { error: unknown }) => {
        console.error("Speech recognition error:", event.error);
        onEnd(finalTranscript.trim());
      };

      recognitionRef.current = recognition;
      recognition.start();

      // Auto stop after 2 minutes
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 120000);
    },
    []
  );

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  return { startRecognition, stopRecognition };
};

export default useSpeechRecognition;
