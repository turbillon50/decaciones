import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAuthUrl, getSpotifyCallbackUrl } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  try {
    const state = crypto.randomUUID();
    const redirectUri = getSpotifyCallbackUrl(request.url);
    const response = NextResponse.redirect(getSpotifyAuthUrl(state, redirectUri));
    response.cookies.set("spotify_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Spotify configuration error",
      },
      { status: 500 },
    );
  }
}
