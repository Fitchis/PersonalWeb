import React from "react";

const MusicPlayer: React.FC = () => {
  return (
    <div className="w-full flex justify-center my-8">
      <iframe
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/playlist/0Sd8veKK0TlkDYrjo8brsE?utm_source=generator&theme=0"
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Playlist"
      />
    </div>
  );
};

export default MusicPlayer;
