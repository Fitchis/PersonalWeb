import { useState, useCallback } from "react";

const useMediaStream = (questionsLength: number) => {
  const [mediaStreams, setMediaStreams] = useState<(MediaStream | null)[]>(() =>
    Array(questionsLength).fill(null)
  );

  const getMediaStream = useCallback(
    async (index: number): Promise<MediaStream> => {
      // Stop existing stream for this index
      if (mediaStreams[index]) {
        mediaStreams[index]?.getTracks().forEach((track) => track.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setMediaStreams((prev) => {
          const newStreams = [...prev];
          newStreams[index] = stream;
          return newStreams;
        });

        return stream;
      } catch (error) {
        throw new Error(`Gagal mengakses kamera/mikrofon: ${error}`);
      }
    },
    [mediaStreams]
  );

  const stopStream = useCallback(
    (index: number) => {
      if (mediaStreams[index]) {
        mediaStreams[index]?.getTracks().forEach((track) => track.stop());
        setMediaStreams((prev) => {
          const newStreams = [...prev];
          newStreams[index] = null;
          return newStreams;
        });
      }
    },
    [mediaStreams]
  );

  const stopAllStreams = useCallback(() => {
    mediaStreams.forEach((stream) => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
    setMediaStreams(Array(questionsLength).fill(null));
  }, [mediaStreams, questionsLength]);

  return { mediaStreams, getMediaStream, stopStream, stopAllStreams };
};

export default useMediaStream;
