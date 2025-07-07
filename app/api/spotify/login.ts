import { NextResponse } from "next/server";

const CLIENT_ID = "b5c8de6db75848598cc71f496ea88630";
const REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI ||
  "https://personal-web-fitchis-projects.vercel.app/api/spotify/callback";
const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-email",
  "user-read-private",
].join(" ");

export async function GET() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    show_dialog: "true",
  });
  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
