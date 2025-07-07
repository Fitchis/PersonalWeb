import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = "b5c8de6db75848598cc71f496ea88630";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI ||
  "https://personal-web-fitchis-projects.vercel.app/api/spotify/callback";

async function getToken(code: string) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Spotify token error: ${res.status} ${errorText}`);
    }
    return res.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Fetch token failed: ${err.message}`);
    }
    throw new Error("Fetch token failed: Unknown error");
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect("/?error=NoCode");
  }
  try {
    const token = await getToken(code);
    if (!token || !token.access_token) {
      return NextResponse.redirect("/?error=TokenError");
    }
    // Simpan token di cookie (httpOnly, secure jika production)
    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.redirect("/");
    res.cookies.set("spotify_access_token", token.access_token, {
      path: "/",
      httpOnly: true,
      secure: isProd,
      maxAge: token.expires_in,
      sameSite: "lax",
    });
    res.cookies.set("spotify_refresh_token", token.refresh_token, {
      path: "/",
      httpOnly: true,
      secure: isProd,
      maxAge: 60 * 60 * 24 * 30, // 30 hari
      sameSite: "lax",
    });
    return res;
  } catch (err: unknown) {
    // Tampilkan error detail di query string agar mudah debug
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.redirect(
      `/?error=SpotifyAuth&msg=${encodeURIComponent(message)}`
    );
  }
}
