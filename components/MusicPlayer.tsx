"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

// Helper to get cookie value
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

interface Track {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string;
  uri: string;
}

const DEFAULT_PLAYLIST = "3cEYpjA9oz9GiPac4AsH4n"; // Spotify Today's Top Hits

const MusicPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk cek token di client agar tidak mismatch SSR/CSR
  const [hasToken, setHasToken] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Cek token dan client mount
  useEffect(() => {
    setIsClient(true);
    setHasToken(!!getCookie("spotify_access_token"));
  }, []);

  // Fetch playlist tracks hanya jika sudah ada token
  useEffect(() => {
    if (!isClient || !hasToken) return;
    const token = getCookie("spotify_access_token");
    if (!token) return;
    setIsLoading(true);
    fetch(`https://api.spotify.com/v1/playlists/${DEFAULT_PLAYLIST}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          let msg = "Gagal fetch playlist";
          try {
            const errJson = await res.json();
            msg += ": " + (errJson.error?.message || JSON.stringify(errJson));
          } catch {}
          throw new Error(msg);
        }
        return res.json();
      })
      .then((data) => {
        type SpotifyTrack = {
          id: string;
          name: string;
          artists: { name: string }[];
          album: { name: string; images: { url: string }[] };
          preview_url: string;
        };
        type SpotifyPlaylistItem = {
          track: SpotifyTrack | null;
        };

        const items = (data.items as SpotifyPlaylistItem[])
          .map((item) => item.track)
          .filter((t): t is SpotifyTrack => !!t && !!t.preview_url)
          .map((t) => ({
            id: t.id,
            name: t.name,
            artists: t.artists.map((a) => a.name).join(", "),
            album: t.album.name,
            image: t.album.images[1]?.url || t.album.images[0]?.url,
            uri: t.preview_url, // only preview_url for browser
          }));
        setTracks(items);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(
          e instanceof Error
            ? e.message
            : "Gagal mengambil playlist Spotify. Login ulang jika perlu."
        );
        setIsLoading(false);
      });
  }, [isClient, hasToken]);

  // Play/pause logic
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
  }, [isPlaying, current]);

  const playNext = () => setCurrent((c) => (c + 1) % tracks.length);
  const playPrev = () =>
    setCurrent((c) => (c - 1 + tracks.length) % tracks.length);

  if (!isClient) {
    return null;
  }

  if (!hasToken) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 border border-gray-700 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl backdrop-blur-lg">
        <span className="text-white font-semibold">Music Player</span>
        <a
          href="/api/spotify/login"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all duration-200"
        >
          Login Spotify
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 border border-red-700 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl backdrop-blur-lg">
        <span className="text-white font-semibold">{error}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 border border-gray-700 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl backdrop-blur-lg">
        <span className="text-white font-semibold">Loading playlist...</span>
      </div>
    );
  }

  if (!tracks.length) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-900/90 border border-yellow-700 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl backdrop-blur-lg">
        <span className="text-yellow-200 font-semibold">
          Playlist tidak memiliki track yang bisa diputar (preview_url kosong).
        </span>
      </div>
    );
  }

  const track = tracks[current];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 border border-gray-700 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl backdrop-blur-lg w-[95vw] max-w-xl">
      <Image
        key={track.id}
        width={56}
        height={56}
        src={track.image}
        alt={track.album}
        className="w-14 h-14 rounded-lg object-cover border border-gray-700"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate">{track.name}</div>
        <div className="text-xs text-gray-300 truncate">{track.artists}</div>
        <div className="text-xs text-gray-500 truncate">{track.album}</div>
      </div>
      <button
        onClick={playPrev}
        className="text-gray-300 hover:text-white text-xl px-2"
      >
        ⏮️
      </button>
      <button
        onClick={() => setIsPlaying((p) => !p)}
        className="text-white bg-purple-600 hover:bg-purple-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl"
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>
      <button
        onClick={playNext}
        className="text-gray-300 hover:text-white text-xl px-2"
      >
        ⏭️
      </button>
      <audio
        ref={audioRef}
        src={track.uri}
        onEnded={playNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};

export default MusicPlayer;
