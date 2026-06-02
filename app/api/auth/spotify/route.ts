import { NextResponse } from "next/server";
import { getSpotifyAuthUrl } from "@/lib/spotify";

export async function GET() {
  try {
    const state = crypto.randomUUID();
    const response = NextResponse.redirect(getSpotifyAuthUrl(state));
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
